import api from './axiosConfig'
import { aReseniaLibroFront, aReseniaVendedorFront } from '../utils/adaptadores'
import { esListaVacia } from '../utils/errorApi'

// ResenaLibroController + ResenaVendedorController (404 = sin reseñas)
const lista = async (pedido) => {
  try { return (await pedido()).data } catch (err) {
    if (esListaVacia(err)) return []
    throw err
  }
}

export const getResenasLibroApi = async (idLibro) => (await lista(() => api.get(`/resenas-libro/libro/${idLibro}`))).map(aReseniaLibroFront)

// El back pide el ítem de la orden que se compró (no el libro): solo quien lo compró y pagó puede reseñar
export const crearResenaLibroApi = async ({ idOrdenItem, calificacion, comentario }) =>
  aReseniaLibroFront((await api.post('/resenas-libro', { idOrdenItem, calificacion, comentario })).data)

export const getResenasVendedorApi = async (idVendedor) =>
  (await lista(() => api.get(`/resenas-vendedor/vendedor/${idVendedor}`))).map(aReseniaVendedorFront)

// OJO: acá el campo se llama "clasificacion" (en las reseñas de libro es "calificacion")
export const crearResenaVendedorApi = async ({ idPago, idVendedor, clasificacion, comentario }) =>
  aReseniaVendedorFront((await api.post('/resenas-vendedor', { idPago, idVendedor, clasificacion, comentario })).data)

export const modificarResenaVendedorApi = async (idResena, { idPago, idVendedor, clasificacion, comentario }) =>
  aReseniaVendedorFront((await api.patch(`/resenas-vendedor/${idResena}`, { idPago, idVendedor, clasificacion, comentario })).data)
