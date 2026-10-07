import { useCallback, useEffect, useRef, useState } from 'react'
import { guardar, leer } from '../services/almacen'
import { claveCart } from '../services/claves'
import { agregarItemApi, cambiarCantidadItemApi, listarCarritoApi, quitarItemApi } from '../api/carritoApi'
import { mensajeError } from '../utils/errorApi'
import { USAR_API } from '../utils/modoApi'

// Carrito de la cuenta con sesión: [{ id: idLibro, q: cantidad, idItem? }].
// Devuelve { carrito, agregar, cambiarCantidad, quitar, vaciar, recargar }. La pantalla no sabe de dónde sale:
//   - Con el back (VITE_API=true): el servidor ES el carrito. Cada acción llama a POST / PATCH / DELETE /carrito/items y la
//     lista se actualiza con lo que responde. Al volver a entrar, GET /carrito devuelve lo mismo en cualquier dispositivo.
//   - Modo demo: el carrito vive en localStorage (se guarda solo).
// `agregar`, `cambiarCantidad` y `quitar` devuelven una promesa (o un valor) que es true si se aplicó, para poder esperar el
// resultado antes de navegar (por ejemplo "Comprar ahora" espera a que el libro esté en el carrito).

// Los usados tienen 1 unidad; los nuevos, hasta 10 por compra (el stock real lo valida el back)
const topeDe = (libro) => (libro.usado ? 1 : 10)

/* ---------- Modo demo: localStorage ---------- */

const useCarritoDemo = (user, { esPropio, avisar }) => {
  const nombre = user ? user.nombreUsuario : null
  const [cargadoDe, setCargadoDe] = useState(nombre)
  const [carrito, setCarrito] = useState(() => (user ? leer(claveCart(user), []) : []))

  // Si cambia la cuenta (entrar, salir, renombrar), se recarga su carrito
  if (cargadoDe !== nombre) {
    setCargadoDe(nombre)
    setCarrito(user ? leer(claveCart(user), []) : [])
  }
  useEffect(() => { if (user) guardar(claveCart(user), carrito) }, [user, carrito])

  const agregar = (libro) => {
    if (esPropio(libro)) {
      avisar('No podés comprar tus propios libros')
      return false
    }
    const tope = topeDe(libro)
    setCarrito((prev) => (prev.some((c) => c.id === libro.id)
      ? prev.map((c) => (c.id === libro.id ? { ...c, q: Math.min(c.q + 1, tope) } : c))
      : [...prev, { id: libro.id, q: 1 }]))
    avisar('Añadido a tu estantería')
    return true
  }

  const cambiarCantidad = (libro, delta) => {
    const tope = topeDe(libro)
    setCarrito((prev) => prev.map((c) => (c.id === libro.id ? { ...c, q: Math.max(1, Math.min(tope, c.q + delta)) } : c)))
    return true
  }

  const quitar = (id) => {
    setCarrito((prev) => prev.filter((c) => c.id !== id))
    return true
  }

  return { carrito, agregar, cambiarCantidad, quitar, vaciar: () => setCarrito([]), recargar: () => Promise.resolve() }
}

/* ---------- Con el back: POST / PATCH / DELETE /carrito/items ---------- */

const useCarritoApi = (user, { esPropio, avisar }) => {
  const idUsuario = user ? user.id : null
  const [carrito, setCarrito] = useState([])
  const ultimo = useRef([]) // último carrito conocido: las acciones en cola lo leen en vez de la copia vieja del render
  const cola = useRef(Promise.resolve())

  const poner = useCallback((lista) => {
    ultimo.current = lista
    setCarrito(lista)
  }, [])

  // Al entrar (o cambiar de cuenta) se pide el carrito al servidor; al salir queda vacío
  useEffect(() => {
    poner([])
    if (idUsuario == null) return undefined
    let vigente = true
    listarCarritoApi().then((lista) => { if (vigente) poner(lista) }).catch(() => {})
    return () => { vigente = false }
  }, [idUsuario, poner])

  const recargar = useCallback(async () => {
    try { poner(await listarCarritoApi()) } catch { /* se queda con lo que había */ }
  }, [poner])

  // Las acciones se hacen de a una, en orden: si alguien toca "Añadir" dos veces seguidas, la segunda ya ve el ítem creado
  // por la primera y lo modifica (POST /carrito/items crearía una fila repetida).
  // Si el back rechaza la acción (sin stock, libro no disponible, compra propia…), se avisa y se vuelve a pedir el carrito.
  const ejecutar = (accion) => {
    const turno = cola.current.then(async () => {
      try {
        await accion()
        return true
      } catch (err) {
        avisar(mensajeError(err))
        await recargar()
        return false
      }
    })
    cola.current = turno
    return turno
  }

  const agregar = (libro) => {
    if (esPropio(libro)) {
      avisar('No podés comprar tus propios libros')
      return Promise.resolve(false)
    }
    return ejecutar(async () => {
      const actual = ultimo.current.find((c) => c.id === libro.id)
      if (actual) {
        const q = Math.min(actual.q + 1, topeDe(libro))
        if (q !== actual.q) {
          const item = await cambiarCantidadItemApi(actual.idItem, q) // PATCH: reemplaza la cantidad
          poner(ultimo.current.map((c) => (c.id === libro.id ? item : c)))
        }
      } else {
        poner([...ultimo.current, await agregarItemApi(libro.id, 1)]) // POST: fila nueva
      }
      avisar('Añadido a tu estantería')
    })
  }

  const cambiarCantidad = (libro, delta) => ejecutar(async () => {
    const actual = ultimo.current.find((c) => c.id === libro.id)
    if (!actual) return
    const q = Math.max(1, Math.min(topeDe(libro), actual.q + delta))
    if (q === actual.q) return
    const item = await cambiarCantidadItemApi(actual.idItem, q)
    poner(ultimo.current.map((c) => (c.id === libro.id ? item : c)))
  })

  const quitar = (id) => ejecutar(async () => {
    const actual = ultimo.current.find((c) => c.id === id)
    if (!actual) return
    await quitarItemApi(actual.idItem)
    poner(ultimo.current.filter((c) => c.id !== id))
  })

  // Después del checkout el back ya vació el carrito: solo se limpia la copia local
  const vaciar = () => poner([])

  return { carrito, agregar, cambiarCantidad, quitar, vaciar, recargar }
}

// El modo se decide una sola vez por build (VITE_API): los hooks siempre se llaman en el mismo orden
const useCarrito = USAR_API ? useCarritoApi : useCarritoDemo

export default useCarrito
