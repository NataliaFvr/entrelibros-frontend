import api, { RAIZ } from './axiosConfig'
import { aLibroFront } from './adaptadores'
import { esListaVacia } from '../utils/errorApi'

// LibrosController + ImagenesLibroController

const TAMANIO = 100
export const TAMANIO_CATALOGO = 12

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

// Una página del catálogo público. A diferencia de `traerPaginas`, esta función
// nunca recorre el resultado completo: `totalElements` y `totalPages` vienen en
// la respuesta de Spring y sirven para el contador y el paginador.
export const getCatalogoApi = async (f, { categorias = [], filtros = {}, provinciaComprador } = {}) => {
  const idCategorias = f.cats.map((nombre) => categorias.find((c) => c.nombre === nombre)?.id).filter(Boolean)
  const idVendedor = (filtros.vendedores || []).find((v) => v.nombre === f.vendedor)?.id
  const sort = { best: 'bestsellers', new: 'nuevo', asc: 'precioAsc', desc: 'precioDesc', disc: 'descuento' }[f.sort]
  const params = {
    page: Math.max(0, f.page - 1), size: TAMANIO_CATALOGO, sort,
    texto: f.q || undefined,
    idCategorias: idCategorias.length ? idCategorias : undefined,
    precioMin: f.min > 0 ? f.min : undefined,
    precioMax: f.max < 500 ? f.max : undefined,
    descuentoMin: f.desc > 1 ? f.desc : undefined,
    soloConDescuento: f.desc === 1 || undefined,
    editoriales: f.ed || undefined, autores: f.autor || undefined, idiomas: f.idioma || undefined,
    idVendedores: idVendedor || undefined,
    estadoLibro: f.estado === 'ambos' ? undefined : f.estado === 'nuevos' ? 'NUEVO' : 'USADO',
    anioMin: f.anio && f.anio !== '0' ? Number(f.anio) : undefined,
    anioMax: f.anio === '0' ? 1999 : undefined,
    // Elegir ambas zonas equivale a no filtrar. El servidor usa la misma regla
    // de provincias que calcula el envío real.
    provinciaComprador: f.envios.length === 1 ? provinciaComprador || undefined : undefined,
    envioLocal: f.envios.length === 1 ? f.envios[0] === 'misma' : undefined,
  }
  const { data } = await api.get('/libros', { params })
  return {
    libros: (data.content || []).map(aLibroFront),
    total: data.totalElements || 0,
    pages: data.totalPages || 0,
  }
}

export const getFiltrosDisponiblesApi = async () => (await api.get('/libros/filtros-disponibles')).data

// Muestra acotada para los componentes fuera del catálogo (inicio, carruseles y sugerencias).
// El catálogo completo usa `getCatalogoApi`; no hay que recorrer todas las páginas acá.
export const getLibrosApi = async () => {
  const { data } = await api.get('/libros', { params: { sort: 'bestsellers', page: 0, size: TAMANIO } })
  return (data.content || []).map(aLibroFront)
}

export const getMisLibrosApi = async () => {
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

export const eliminarImagenApi = async (idImagen) => (await api.delete(`/imagenes-libro/${idImagen}`)).data

export const getImagenesConIdApi = async (idLibro) => {
  try {
    const { data } = await api.get(`/imagenes-libro/libro/${idLibro}`)
    return [...data].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)).map((i) => ({ id: i.id, url: urlImagen(i.id) }))
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
