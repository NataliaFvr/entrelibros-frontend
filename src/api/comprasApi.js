import api from './axiosConfig'
import { aPedidoFront } from '../utils/adaptadores'
import { esListaVacia } from '../utils/errorApi'

// CarritoController + OrdenController + PagoController

const lista = async (pedido) => {
  try { return (await pedido()).data } catch (err) {
    if (esListaVacia(err)) return [] // ListaVaciaException: "sin elementos" no es un error
    throw err
  }
}

// El carrito vive en el front hasta confirmar la compra; ahí se copia al carrito del back (que arma la orden)
export const sincronizarCarritoApi = async (idUsuario, carrito) => {
  const actuales = await lista(() => api.get('/carrito'))
  await Promise.all(actuales.map((i) => api.delete(`/carrito/items/${i.id}`)))
  for (const c of carrito) await api.post('/carrito/items', { idUsuario, idLibro: c.id, cantidad: c.q })
}

// POST /carrito/checkout -> OrdenResponse PENDIENTE con reservaHasta (1 hora)
export const checkoutApi = async (idUsuario, provinciaDestino) =>
  (await api.post('/carrito/checkout', { idUsuario, provinciaDestino })).data

// GET /ordenes y GET /ordenes/comprador devuelven las órdenes SIN items: el detalle (GET /ordenes/{id}) los trae
const conDetalle = (ordenes) => Promise.all(ordenes.map(async (o) => {
  try { return (await api.get(`/ordenes/${o.id}`)).data } catch { return o }
}))

export const listarPedidosApi = async () => (await conDetalle(await lista(() => api.get('/ordenes/comprador')))).map(aPedidoFront)

export const cancelarOrdenApi = async (idOrden) => (await api.patch(`/ordenes/${idOrden}/cancelar`)).data

// POST /pagos { idOrden, proveedor } -> PagoResponse { id, resultado, … } (hoy el back aprueba siempre: SIMULADO_APROBADO)
export const crearPagoApi = async (idOrden, proveedor) => (await api.post('/pagos', { idOrden, proveedor })).data
export const pagosDeOrdenApi = async (idOrden) => lista(() => api.get(`/pagos/orden/${idOrden}`))

// ADMIN: GET /ordenes y GET /pagos
export const listarOrdenesAdminApi = async () => (await conDetalle(await lista(() => api.get('/ordenes')))).map(aPedidoFront)
export const listarPagosAdminApi = async () => lista(() => api.get('/pagos'))
