import { useCallback, useEffect, useRef, useState } from 'react'
import { agregarItemApi, cambiarCantidadItemApi, listarCarritoApi, quitarItemApi } from '../api/carritoApi'
import { mensajeError } from '../utils/errorApi'

// Carrito de la cuenta con sesión: [{ id: idLibro, q: cantidad, idItem? }], sincronizado con el servidor.
// `agregar`, `cambiarCantidad` y `quitar` devuelven una promesa (o un valor) que es true si se aplicó, para poder esperar el
// resultado antes de navegar (por ejemplo "Comprar ahora" espera a que el libro esté en el carrito).

const useCarrito = (user, { esPropio, avisar }) => {
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
        const q = Math.min(actual.q + 1, actual.maxCantidad)
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
    const q = Math.max(1, Math.min(actual.maxCantidad, actual.q + delta))
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

export default useCarrito
