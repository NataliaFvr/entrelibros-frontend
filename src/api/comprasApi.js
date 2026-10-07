import api from './axiosConfig'
import { aPedidoFront, provinciaParaBack } from '../utils/adaptadores'
import { esListaVacia } from '../utils/errorApi'

// OrdenController + PagoController (el carrito está en carritoApi.js)

const lista = async (pedido) => {
  try { return (await pedido()).data } catch (err) {
    if (esListaVacia(err)) return [] // ListaVaciaException: "sin elementos" no es un error
    throw err
  }
}

// POST /carrito/checkout { idDireccion, provinciaDestino } -> OrdenResponse PENDIENTE con reservaHasta (1 hora).
// El carrito ya está en el back (api/carritoApi.js): el checkout lo convierte en orden y lo vacía.
// idDireccion es lo que manda la interfaz: el back copia calle/ciudad/CP de esa dirección a la orden y la provincia sale de
// ella (ignora provinciaDestino). provinciaDestino se manda igual como respaldo, por si la dirección no tuviera id.
// El usuario NO viaja en el cuerpo: el back lo saca del token.
export const checkoutApi = async ({ idDireccion, provincia }) =>
  (await api.post('/carrito/checkout', {
    ...(idDireccion != null ? { idDireccion } : {}),
    ...(provincia ? { provinciaDestino: provinciaParaBack(provincia) } : {}),
  })).data

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
