import { useEffect, useState } from 'react'
import { CompraCtx } from './compraCtx'
import { useAuth } from '../hooks/useAuth'
import { useLibros } from '../hooks/useLibros'
import { useToast } from '../hooks/useToast'
import { guardar, leer } from '../services/almacen'
import { claveCart, clavePedidos } from '../services/claves'
import { costoEnvio } from '../utils/envio'
import { RESERVA_MS, estadoPago, subtotal } from '../utils/pedidos'

const cargar = (user) => ({
  carrito: user ? leer(claveCart(user), []) : [],
  pedidos: user ? leer(clavePedidos(user), []) : [],
})

// Carrito y pedidos de la cuenta que tiene la sesión. Se guardan solos en localStorage.
// Back: POST /carrito/checkout {provinciaDestino} -> orden PENDIENTE (reserva 1 h), POST /pagos, PATCH /ordenes/{id}/cancelar
const CompraProvider = ({ children }) => {
  const { user } = useAuth()
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
  useEffect(() => { if (user) guardar(clavePedidos(user), pedidos) }, [user, pedidos])

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
    const tope = libro.usado ? 1 : 10
    setCarrito((prev) => (prev.some((c) => c.id === libro.id)
      ? prev.map((c) => (c.id === libro.id ? { ...c, q: Math.min(c.q + 1, tope) } : c))
      : [...prev, { id: libro.id, q: 1 }]))
    toast('Agregado al carrito')
  }

  const cambiarCantidad = (libro, delta) => {
    const tope = libro.usado ? 1 : 10
    setCarrito((prev) => prev.map((c) => (c.id === libro.id ? { ...c, q: Math.max(1, Math.min(tope, c.q + delta)) } : c)))
  }

  const quitar = (id) => setCarrito((prev) => prev.filter((c) => c.id !== id))

  // Convierte el carrito en un pedido pendiente de pago y devuelve su número
  const crearPedido = (direccion) => {
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

  // Back: POST /pagos {idOrden, proveedor}
  const pagarPedido = (n, proveedor) =>
    setPedidos((prev) => prev.map((o) => (o.n === n && estadoPago(o) === 'PENDIENTE'
      ? { ...o, pago: 'SIMULADO_APROBADO', est: 'Confirmada', proveedor, reserva: undefined } : o)))

  const cancelarPedido = (n) => {
    setPedidos((prev) => prev.map((o) => (o.n === n && estadoPago(o) === 'PENDIENTE'
      ? { ...o, pago: 'CANCELADO', est: 'Cancelada', reserva: undefined } : o)))
    toast('Compra cancelada. Liberamos tus libros.')
  }

  // ¿Tiene un pedido pagado con este libro? (solo así puede opinar)
  const compro = (idLibro) => pedidos.some((o) => estadoPago(o) === 'SIMULADO_APROBADO' && o.its.some((i) => i.id === idLibro))

  const value = {
    carrito, pedidos, compro, cartCount: carrito.reduce((n, c) => n + c.q, 0),
    agregar, cambiarCantidad, quitar, crearPedido, pagarPedido, cancelarPedido,
  }
  return <CompraCtx.Provider value={value}>{children}</CompraCtx.Provider>
}

export default CompraProvider
