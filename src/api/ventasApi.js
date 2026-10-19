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

// PATCH /ordenes/vendedor/{id}/cancelar: solo una venta sin pagar. El back saca esos libros de la orden del
// comprador, devuelve el stock y le recalcula el total.
export const cancelarVentaApi = async (idOrdenVendedor) =>
  (await api.patch(`/ordenes/vendedor/${idOrdenVendedor}/cancelar`)).data
