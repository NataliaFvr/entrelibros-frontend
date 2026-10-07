import api, { RAIZ } from './axiosConfig'
import { aLibroFront } from '../utils/adaptadores'
import { listarCategoriasApi } from './categoriasApi'
import { esListaVacia } from '../utils/errorApi'

// LibrosController + ImagenesLibroController

const TAMANIO = 100

// Recorre todas las páginas de un listado paginado (Page<T> de Spring). El back responde 404 { error } (ListaVaciaException) cuando no hay resultados:
// - 404 en la página 0 -> no hay resultados: devuelve [].
// - 404 en una página > 0 -> se acabó la paginación: devuelve lo que ya juntó (no es un error).
// Cualquier otro fallo (401, 403, 500, red, un 404 que no es de lista vacía) se propaga: quien llama lo muestra con mensajeError().
export const traerPaginas = async (url, params = {}) => {
  const todo = []
  for (let page = 0; ; page++) {
    let pagina
    try {
      pagina = (await api.get(url, { params: { ...params, page, size: TAMANIO } })).data
    } catch (err) {
      if (esListaVacia(err)) return page === 0 ? [] : todo
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

// Libros del vendedor `idVendedor`, usando el filtro idVendedores de GET /libros. OJO: el back solo lista los visibles (ACEPTADOS y ACTIVOS);
// los pendientes, rechazados o dados de baja no se pueden pedir porque no existe un endpoint de "mis libros".
// Sin libros -> []; cualquier otro error se propaga.
export const getMisLibrosApi = async (idVendedor) => (await traerPaginas('/libros', { idVendedores: [idVendedor] })).map(aLibroFront)

export const getLibroApi = async (id) => aLibroFront((await api.get(`/libros/${id}`)).data)
export const crearLibroApi = async (request) => (await api.post('/libros', request)).data
export const darDeBajaApi = async (id) => (await api.patch(`/libros/${id}/baja`)).data
export const reactivarApi = async (id) => (await api.patch(`/libros/${id}/reactivar`)).data

/* ---------- Imágenes ---------- */

export const urlImagen = (idImagen) => `${RAIZ}/imagenes-libro/${idImagen}/contenido`

// URLs de las fotos de un libro, en orden (404 { error } = el libro no tiene fotos)
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
