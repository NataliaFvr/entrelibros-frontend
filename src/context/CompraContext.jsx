import { useCallback, useEffect, useState } from 'react'
import { CompraCtx } from './compraCtx'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import useCarrito from '../hooks/useCarrito'
import { cancelarOrdenApi, checkoutApi, crearPagoApi, listarPedidosApi } from '../api/comprasApi'
import { mensajeError } from '../utils/errorApi'

// Carrito y pedidos de la cuenta que tiene la sesión.
// El carrito lo maneja hooks/useCarrito.js: cada acción se sincroniza con /carrito/items y el
// checkout (POST /carrito/checkout { idDireccion, provinciaDestino }) usa ese mismo carrito -> orden PENDIENTE (reserva 1 h);
// luego POST /pagos y PATCH /ordenes/{id}/cancelar.
// El número de pedido (`n`) es el id de la orden.
const CompraProvider = ({ children }) => {
  const { user, quitarMarks } = useAuth()
  const toast = useToast()
  const { carrito, agregar, cambiarCantidad, quitar, vaciar } = useCarrito(user, { avisar: toast })
  const nombre = user ? user.nombreUsuario : null
  const [cargadoDe, setCargadoDe] = useState(nombre)
  const [pedidos, setPedidos] = useState([])

  // Si cambia la cuenta (entrar, salir, renombrar), se recargan sus pedidos
  if (cargadoDe !== nombre) {
    setCargadoDe(nombre)
    setPedidos([])
  }

  // Los pedidos salen del servidor; cada orden ya incluye sus ítems.
  const refrescarPedidos = useCallback(async () => {
    try { setPedidos(await listarPedidosApi()) } catch { /* se queda con lo que había */ }
  }, [])
  const idApi = user && user.rol !== 'ADMIN' ? user.id : null // el admin no tiene compras
  useEffect(() => {
    if (!idApi) return undefined
    let vigente = true
    listarPedidosApi().then((lista) => { if (vigente) setPedidos(lista) }).catch(() => {})
    return () => { vigente = false }
  }, [idApi])

  // Convierte el carrito en un pedido pendiente de pago y devuelve su número.
  // `direccion` = la dirección elegida { id, alias, calle, ciudad, prov, cp }: con el back viaja su id (idDireccion) y la
  // orden guarda la dirección completa; el costo de envío lo calcula el back.
  const crearPedido = (direccion) => {
    return crearPedidoApi(direccion)
  }

  const crearPedidoApi = async (direccion) => {
    try {
      const orden = await checkoutApi({ idDireccion: direccion.id, provincia: direccion.prov })
      vaciar() // el back ya vació el carrito al crear la orden
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
  const pagarPedido = pagarPedidoApi

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

  const cancelarPedido = cancelarPedidoApi

  const value = {
    carrito, pedidos, cartCount: carrito.reduce((n, c) => n + c.q, 0),
    agregar, cambiarCantidad, quitar, crearPedido, pagarPedido, cancelarPedido,
  }
  return <CompraCtx.Provider value={value}>{children}</CompraCtx.Provider>
}

export default CompraProvider
