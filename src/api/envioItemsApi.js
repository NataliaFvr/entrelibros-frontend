import api from './axiosConfig'
import { esListaVacia } from '../utils/errorApi'

// EnvioItemController: el envío REGISTRADO de una venta (OrdenVendedor).
// EnvioItemResponse { id, costo, idOrdenVendedor, zona: 'misma' | 'distinta' }.
// El back guarda un solo envío por OrdenVendedor: registrar dos veces devuelve el mismo, no duplica el cobro.

const lista = async (pedido) => {
  try { return (await pedido()).data } catch (err) {
    if (esListaVacia(err)) return [] // ListaVaciaException: "no hay envíos" no es un error
    throw err
  }
}

// POST /envio-items { idOrdenVendedor } — solo VENDEDOR dueño de la venta.
// El tipo de envío NO se manda: el back usa el que se cobró en el checkout.
export const registrarEnvioApi = async (idOrdenVendedor) =>
  (await api.post('/envio-items', { idOrdenVendedor })).data

// GET /envio-items — todos los envíos registrados (404 con { error } si no hay ninguno)
export const listarEnviosApi = async () => lista(() => api.get('/envio-items'))

// GET /envio-items/{id}
export const obtenerEnvioApi = async (idEnvioItem) => (await api.get(`/envio-items/${idEnvioItem}`)).data

// GET /envio-items/orden-vendedor/{id} — los envíos de una venta ([] si todavía no se registró)
export const listarEnviosDeVentaApi = async (idOrdenVendedor) =>
  lista(() => api.get(`/envio-items/orden-vendedor/${idOrdenVendedor}`))
