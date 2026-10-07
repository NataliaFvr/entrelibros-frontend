import api from './axiosConfig'
import { esListaVacia } from '../utils/errorApi'

// OrdenController, parte del vendedor.
// GET /ordenes/vendedor -> [{ id, estado, idOrden, idVendedor, nombreVendedor }]: no trae fecha, items ni comprador.
// Ese detalle sale de GET /ordenes/{idOrden} (el vendedor de la orden tiene permiso), que devuelve OrdenResponse con items.
// Devuelve [{ ordenVendedor, orden }]; el mapeo al formato del front vive en aVentaFront (utils/adaptadores.js).
export const listarVentasApi = async () => {
  let ordenesVendedor
  try {
    ordenesVendedor = (await api.get('/ordenes/vendedor')).data
  } catch (err) {
    if (esListaVacia(err)) return [] // ListaVaciaException: "todavía no vendiste" no es un error
    throw err
  }
  return Promise.all(ordenesVendedor.map(async (ordenVendedor) => {
    try { return { ordenVendedor, orden: (await api.get(`/ordenes/${ordenVendedor.idOrden}`)).data } } catch { return { ordenVendedor, orden: null } }
  }))
}
