import api from './axiosConfig'
import { esListaVacia } from '../utils/errorApi'

// OrdenController, parte del vendedor.
// GET /ordenes/vendedor devuelve cada venta con sus ítems, fecha, comprador y destino.
export const listarVentasApi = async () => {
  try {
    return (await api.get('/ordenes/vendedor')).data
  } catch (err) {
    if (esListaVacia(err)) return [] // ListaVaciaException: "todavía no vendiste" no es un error
    throw err
  }
}

// PATCH /ordenes/vendedor/{idOrdenVendedor}/cancelar — el vendedor cancela SU parte de la orden (el back devuelve el stock).
// Responde la OrdenVendedorResponse con estado 'CANCELADA'. Cancelar dos veces es inofensivo.
export const cancelarVentaApi = async (idOrdenVendedor) =>
  (await api.patch(`/ordenes/vendedor/${idOrdenVendedor}/cancelar`)).data
