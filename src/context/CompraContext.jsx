import { useCallback, useEffect, useState } from 'react'
import { CompraCtx } from './compraCtx'
import { useAuth } from '../hooks/useAuth'
import { useLibros } from '../hooks/useLibros'
import { useToast } from '../hooks/useToast'
import { guardar, leer } from '../services/almacen'
import { claveCart, clavePedidos } from '../services/claves'
import { esLibroPropio } from '../services/vendedorService'
import { cancelarOrdenApi, checkoutApi, crearPagoApi, listarPedidosApi, sincronizarCarritoApi } from '../api/comprasApi'
import { provinciaParaBack } from '../utils/adaptadores'
import { mensajeError } from '../utils/errorApi'
import { USAR_API } from '../utils/modoApi'
import { costoEnvio } from '../utils/envio'
import { RESERVA_MS, estadoPago, subtotal } from '../utils/pedidos'

const cargar = (user) => ({
  carrito: user ? leer(claveCart(user), []) : [],
  pedidos: user && !USAR_API ? leer(clavePedidos(user), []) : [], // con el back los pedidos se piden a GET /ordenes/comprador
})

// Carrito y pedidos de la cuenta que tiene la sesión. Se guardan solos en localStorage.
// Con el back (VITE_API=true): el carrito se arma acá y, al confirmar, se copia al carrito del back para
// POST /carrito/checkout {idUsuario, provinciaDestino} -> orden PENDIENTE (reserva 1 h); luego POST /pagos y PATCH /ordenes/{id}/cancelar.
// El número de pedido (`n`) es el id de la orden.
const CompraProvider = ({ children }) => {
  const { user, quitarMarks } = useAuth()
  const { libros } = useLibros()
  const toast = useToast()
  const nombre = user ? user.nombreUsuario : null
  const [cargadoDe, setCargadoDe] = useState(nombre)
  const [carrito, setCarrito] = useState(() => cargar(user).carrito)
  const [pedidos, setPedidos] = useState(() => cargar(user).pedidos)

  // Si cambia la cuenta (entrar, salir, renombrar), se recargan sus datos
  if (cargadoDe !== nombre) {
    const datos = cargar(user)
    setCargadoDe(nombre)
    setCarrito(datos.carrito)
    setPedidos(datos.pedidos)
  }

  useEffect(() => { if (user) guardar(claveCart(user), carrito) }, [user, carrito])
  useEffect(() => { if (user && !USAR_API) guardar(clavePedidos(user), pedidos) }, [user, pedidos])

  // Con el back: los pedidos salen del servidor (GET /ordenes/comprador + detalle de cada orden)
  const refrescarPedidos = useCallback(async () => {
    try { setPedidos(await listarPedidosApi()) } catch { /* se queda con lo que había */ }
  }, [])
  const idApi = USAR_API && user ? user.id : null
  useEffect(() => {
    if (!idApi) return undefined
    let vigente = true
    listarPedidosApi().then((lista) => { if (vigente) setPedidos(lista) }).catch(() => {})
    return () => { vigente = false }
  }, [idApi])

  // Mientras haya pedidos pendientes, pasa a "vencido" los que se quedaron sin reserva
  useEffect(() => {
    if (!pedidos.some((o) => o.pago === 'PENDIENTE')) return
    const t = setInterval(() => {
      const ahora = Date.now()
      const venció = (o) => o.pago === 'PENDIENTE' && estadoPago(o, ahora) === 'VENCIDO'
      setPedidos((prev) => (prev.some(venció) ? prev.map((o) => (venció(o) ? { ...o, pago: 'VENCIDO', est: 'Vencida', reserva: undefined } : o)) : prev))
    }, 1000)
    return () => clearInterval(t)
  }, [pedidos])

  // Los usados tienen 1 unidad; los nuevos, hasta 10 por compra
  const agregar = (libro) => {
    if (esLibroPropio(user, libro)) {
      toast('No podés comprar tus propios libros')
      return
    }
    const tope = libro.usado ? 1 : 10
    setCarrito((prev) => (prev.some((c) => c.id === libro.id)
      ? prev.map((c) => (c.id === libro.id ? { ...c, q: Math.min(c.q + 1, tope) } : c))
      : [...prev, { id: libro.id, q: 1 }]))
    toast('Añadido a tu estantería')
  }

  const cambiarCantidad = (libro, delta) => {
    const tope = libro.usado ? 1 : 10
    setCarrito((prev) => prev.map((c) => (c.id === libro.id ? { ...c, q: Math.max(1, Math.min(tope, c.q + delta)) } : c)))
  }

  const quitar = (id) => setCarrito((prev) => prev.filter((c) => c.id !== id))

  // Convierte el carrito en un pedido pendiente de pago y devuelve su número
  // `prov` = provincia de la dirección elegida (con el back se envía como provinciaDestino)
  const crearPedido = (direccion, prov) => {
    if (USAR_API) return crearPedidoApi(prov)
    const items = carrito
      .map((c) => ({ id: c.id, q: c.q, p: libros.find((l) => l.id === c.id)?.p }))
      .filter((i) => i.p !== undefined)
    const n = `EL-${String(Date.now()).slice(-5)}`
    const pedido = {
      n, date: new Date().toISOString().slice(0, 10), its: items, addr: direccion,
      sub: subtotal(items), env: costoEnvio(items, libros), est: 'Pendiente', pago: 'PENDIENTE', reserva: Date.now() + RESERVA_MS,
    }
    setPedidos((prev) => [pedido, ...prev])
    setCarrito([])
    toast('Reservamos tus libros por 1 hora')
    return n
  }

  const crearPedidoApi = async (prov) => {
    try {
      await sincronizarCarritoApi(user.id, carrito)
      const orden = await checkoutApi(user.id, provinciaParaBack(prov))
      setCarrito([])
      await refrescarPedidos()
      toast('Reservamos tus libros por 1 hora')
      return String(orden.id)
    } catch (err) {
      throw new Error(mensajeError(err))
    }
  }

  // POST /pagos {idOrden, proveedor}: devuelve el resultado del pago (el back hoy aprueba siempre: SIMULADO_APROBADO)
  const pagarPedidoApi = async (n, proveedor) => {
    const pedido = pedidos.find((o) => o.n === n)
    try {
      const pago = await crearPagoApi(Number(n), proveedor)
      await refrescarPedidos()
      if (pago.resultado === 'SIMULADO_APROBADO' && pedido) quitarMarks(pedido.its.map((i) => i.id))
      return pago.resultado
    } catch (err) {
      await refrescarPedidos() // por ejemplo, la reserva venció mientras se pagaba
      throw new Error(mensajeError(err))
    }
  }

  // Al aprobarse el pago, los libros dejan de ser un deseo: se sacan del Marcapáginas
  const pagarPedido = (n, proveedor) => {
    if (USAR_API) return pagarPedidoApi(n, proveedor)
    const pedido = pedidos.find((o) => o.n === n)
    if (!pedido || estadoPago(pedido) !== 'PENDIENTE') return
    setPedidos((prev) => prev.map((o) => (o.n === n && estadoPago(o) === 'PENDIENTE'
      ? { ...o, pago: 'SIMULADO_APROBADO', est: 'Confirmada', proveedor, reserva: undefined } : o)))
    quitarMarks(pedido.its.map((i) => i.id))
  }

  const cancelarPedidoApi = async (n) => {
    try {
      await cancelarOrdenApi(Number(n))
      await refrescarPedidos()
      toast('Compra cancelada. Liberamos tus libros.')
    } catch (err) {
      toast(mensajeError(err))
      await refrescarPedidos()
    }
  }

  const cancelarPedido = (n) => {
    if (USAR_API) return cancelarPedidoApi(n)
    setPedidos((prev) => prev.map((o) => (o.n === n && estadoPago(o) === 'PENDIENTE'
      ? { ...o, pago: 'CANCELADO', est: 'Cancelada', reserva: undefined } : o)))
    toast('Compra cancelada. Liberamos tus libros.')
  }

  // ¿Tiene un pedido pagado con este libro? (solo así puede opinar)
  const compro = (idLibro) => pedidos.some((o) => estadoPago(o) === 'SIMULADO_APROBADO' && o.its.some((i) => i.id === idLibro))

  // Ítem de la orden (idOrdenItem) con el que se compró y pagó un libro: el back lo pide para reseñarlo
  const itemPagado = (idLibro) => {
    for (const o of pedidos) {
      if (estadoPago(o) !== 'SIMULADO_APROBADO') continue
      const item = o.its.find((i) => i.id === idLibro)
      if (item) return { idItem: item.idItem, idOrden: o.idOrden, pedido: o }
    }
    return null
  }

  const value = {
    carrito, pedidos, compro, itemPagado, cartCount: carrito.reduce((n, c) => n + c.q, 0),
    agregar, cambiarCantidad, quitar, crearPedido, pagarPedido, cancelarPedido,
  }
  return <CompraCtx.Provider value={value}>{children}</CompraCtx.Provider>
}

export default CompraProvider
