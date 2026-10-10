import api from './axiosConfig'
import { aReseniaLibroFront } from './adaptadores'
import { esListaVacia } from '../utils/errorApi'

// Todas las opiniones de los libros de un vendedor, sin consultar una vez por publicación.
export const getOpinionesVendedor = async (idVendedor) => {
  try {
    const { data } = await api.get(`/resenas-libro/vendedor/${idVendedor}/opiniones-libros`)
    return data.map((r) => ({ ...aReseniaLibroFront(r), libro: r.tituloLibro || '', clave: `${r.idLibro}-${r.id}` }))
      .sort((a, b) => String(b.date).localeCompare(String(a.date)))
  } catch (err) {
    if (esListaVacia(err)) return []
    throw err
  }
}
