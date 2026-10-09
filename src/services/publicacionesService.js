import { getImagenesApi, getMisLibrosApi } from '../api/librosApi'
import { publicacionAFront } from '../utils/adaptadores'
import { categoriasDe } from '../utils/libro'

// Publicaciones del vendedor en el formato del panel { id, t, a, ed, cat, idioma, anio, usado, base, d, stock, imgs, descripcion,
// estado: 'activo' | 'baja', mod: 'EN_REVISION' | 'ACEPTADO' | 'RECHAZADO' }. Solo se usa con el back.

// Categorías del libro: las del back si las trae (LibroResponse.categorias) o las del catálogo ya cargado; si no, las guardadas.
// `cat` es la que se muestra (la primera de `cats`).
const categoriasPublicacion = (l, previa, catalogo) => {
  const delCatalogo = catalogo.find((x) => x.id === l.id)
  const cats = [l.cats, delCatalogo && delCatalogo.cats, categoriasDe(previa)].find((c) => Array.isArray(c) && c.length) || []
  return { cats, cat: cats[0] || '' }
}

// Lo que el panel muestra de un libro del back, conservando lo que el back no informa (categoría, fotos, motivo de rechazo…)
const desdeBack = (l, previa = {}, catalogo = []) => {
  const { revision, ...resto } = previa // eslint-disable-line no-unused-vars
  return {
    ...resto, id: l.id, t: l.t, a: l.a, ed: l.ed, idioma: l.idioma, anio: l.anio, usado: l.usado, base: l.base, d: l.d, stock: l.stock,
    descripcion: l.descripcion, mod: l.estadoModeracion || previa.mod, estado: publicacionAFront(l.estadoPublicacion),
    ...categoriasPublicacion(l, previa, catalogo), imgs: previa.imgs || [],
  }
}

export const traerPublicaciones = async (locales, catalogo) => {
  const mios = await getMisLibrosApi()
  const previas = new Map(locales.map((p) => [p.id, p]))
  return Promise.all(mios.map(async (l) => {
    const p = desdeBack(l, previas.get(l.id), catalogo)
    if (!p.imgs.length) p.imgs = await getImagenesApi(l.id).catch(() => [])
    return p
  }))
}
