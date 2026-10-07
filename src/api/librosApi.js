import api, { RAIZ } from './axiosConfig'
import { aLibroFront } from '../utils/adaptadores'
import { listarCategoriasApi } from './categoriasApi'
import { esListaVacia } from '../utils/errorApi'

// LibrosController + ImagenesLibroController

const TAMANIO = 100

// Recorre todas las páginas de un listado paginado (Page<T> de Spring). El back responde 404 si no hay resultados.
export const traerPaginas = async (url, params = {}) => {
  const todo = []
  for (let page = 0; ; page++) {
    let pagina
    try {
      pagina = (await api.get(url, { params: { ...params, page, size: TAMANIO } })).data
    } catch (err) {
      if (esListaVacia(err)) return todo
      throw err
    }
    todo.push(...(pagina.content || []))
    if (pagina.last || pagina.empty || !pagina.content || !pagina.content.length) return todo
  }
}

// Catálogo público (solo libros ACEPTADOS y ACTIVOS). El orden "bestsellers" del back da el ranking de ventas;
// las categorías salen de pedir el catálogo filtrado por cada una (LibroResponse no trae categorías).
export const getLibrosApi = async () => {
  const [base, categorias] = await Promise.all([traerPaginas('/libros', { sort: 'bestsellers' }), listarCategoriasApi()])
  const libros = base.map(aLibroFront)
  libros.forEach((l, i) => { l.ventas = libros.length > 1 ? 1 - i / libros.length : 1 })
  const porId = new Map(libros.map((l) => [l.id, l]))
  await Promise.all(categorias.map(async (c) => {
    const delaCategoria = await traerPaginas('/libros', { idCategorias: [c.id] })
    delaCategoria.forEach((r) => { const l = porId.get(r.id); if (l && !l.cat) l.cat = c.nombre })
  }))
  return libros
}

// GET /libros/mios -> publicaciones del vendedor logueado, de cualquier estado (en revisión, rechazadas, de baja…).
// El back todavía NO tiene este endpoint (hoy lo toma como /libros/{id} con id "mios" y responde 400). Mientras tanto
// MIS_LIBROS_EN_BACK = false y esta función devuelve null: quien llama usa su respaldo (publicacionesService.js).
// Cuando el back lo sume: ponerlo en true. Contrato esperado:
//   - 200 Page<LibroResponse> con los libros del vendedor.
//   - 404 { error } (ListaVaciaException) si no tiene libros / el filtro no coincide / la página no existe -> acá se lee como [].
//   - 401/403/500/red -> se propagan (nunca se confunden con "sin libros"); el que llama muestra mensajeError().
export const MIS_LIBROS_EN_BACK = false

export const getMisLibrosApi = async () => {
  if (!MIS_LIBROS_EN_BACK) return null
  return (await traerPaginas('/libros/mios')).map(aLibroFront)
}

export const getLibroApi = async (id) => aLibroFront((await api.get(`/libros/${id}`)).data)
export const crearLibroApi = async (request) => (await api.post('/libros', request)).data
export const darDeBajaApi = async (id) => (await api.patch(`/libros/${id}/baja`)).data
export const reactivarApi = async (id) => (await api.patch(`/libros/${id}/reactivar`)).data

/* ---------- Imágenes ---------- */

export const urlImagen = (idImagen) => `${RAIZ}/imagenes-libro/${idImagen}/contenido`

// URLs de las fotos de un libro, en orden (404 = el libro no tiene fotos)
export const getImagenesApi = async (idLibro) => {
  try {
    const { data } = await api.get(`/imagenes-libro/libro/${idLibro}`)
    return [...data].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)).map((i) => urlImagen(i.id))
  } catch (err) {
    if (esListaVacia(err)) return []
    throw err
  }
}

// POST /imagenes-libro (multipart: archivo, orden, idLibro). Solo VENDEDOR dueño del libro.
export const subirImagenApi = async (idLibro, archivo, orden) => {
  const form = new FormData()
  form.append('archivo', archivo)
  form.append('orden', String(orden))
  form.append('idLibro', String(idLibro))
  return (await api.post('/imagenes-libro', form, { headers: { 'Content-Type': 'multipart/form-data' } })).data
}
