import api from './axiosConfig'
import { aPedidoFront, provinciaParaBack } from './adaptadores'
import { esListaVacia } from '../utils/errorApi'

// OrdenController + PagoController (el carrito está en carritoApi.js)

const lista = async (pedido) => {
  try { return (await pedido()).data } catch (err) {
    if (esListaVacia(err)) return [] // ListaVaciaException: "sin elementos" no es un error
    throw err
  }
}

// POST /carrito/checkout { idDireccion, provinciaDestino } -> OrdenResponse PENDIENTE con costoEnvio y venceEn.
// El carrito ya está en el back (api/carritoApi.js): el checkout lo convierte en orden y lo vacía.
// idDireccion es lo que manda la interfaz: el back copia calle/ciudad/CP de esa dirección a la orden y la provincia sale de
// ella (ignora provinciaDestino). provinciaDestino se manda igual como respaldo, por si la dirección no tuviera id.
// El usuario NO viaja en el cuerpo: el back lo saca del token.
export const checkoutApi = async ({ idDireccion, provincia }) =>
  (await api.post('/carrito/checkout', {
    ...(idDireccion != null ? { idDireccion } : {}),
    ...(provincia ? { provinciaDestino: provinciaParaBack(provincia) } : {}),
  })).data

// GET /ordenes/comprador ya devuelve cada orden con sus ítems.
export const listarPedidosApi = async () => (await lista(() => api.get('/ordenes/comprador'))).map(aPedidoFront)

export const cancelarOrdenApi = async (idOrden) => (await api.patch(`/ordenes/${idOrden}/cancelar`)).data

// POST /pagos { idOrden, proveedor } -> PagoResponse { id, resultado, … } (hoy el back aprueba siempre: SIMULADO_APROBADO)
export const crearPagoApi = async (idOrden, proveedor) => (await api.post('/pagos', { idOrden, proveedor })).data
export const pagosDeOrdenApi = async (idOrden) => lista(() => api.get(`/pagos/orden/${idOrden}`))

// ADMIN: GET /ordenes y GET /pagos. Las órdenes ya incluyen sus ítems.
export const listarOrdenesAdminApi = async () => (await lista(() => api.get('/ordenes'))).map(aPedidoFront)
export const listarPagosAdminApi = async () => lista(() => api.get('/pagos'))
