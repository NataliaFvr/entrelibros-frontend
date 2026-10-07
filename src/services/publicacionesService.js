import { getImagenesApi, getLibroApi, getMisLibrosApi } from '../api/librosApi'
import { publicacionAFront } from '../utils/adaptadores'

// Publicaciones del vendedor en el formato del panel { id, t, a, ed, cat, idioma, anio, usado, base, d, stock, imgs, descripcion,
// estado: 'activo' | 'baja', mod: 'EN_REVISION' | 'ACEPTADO' | 'RECHAZADO' }. Solo se usa con el back.

// Lo que el panel muestra de un libro del back, conservando lo que el back no informa (categoría, fotos, motivo de rechazo…)
const desdeBack = (l, previa = {}, catalogo = []) => {
  const { revision, ...resto } = previa // eslint-disable-line no-unused-vars
  return {
    ...resto, id: l.id, t: l.t, a: l.a, ed: l.ed, idioma: l.idioma, anio: l.anio, usado: l.usado, base: l.base, d: l.d, stock: l.stock,
    descripcion: l.descripcion, mod: l.estadoModeracion || previa.mod, estado: publicacionAFront(l.estadoPublicacion),
    cat: previa.cat || (catalogo.find((x) => x.id === l.id) || {}).cat || '', imgs: previa.imgs || [],
  }
}

// GET /libros/mios es la fuente de verdad. Si el back todavía no lo tiene, se usa la lista guardada en este navegador
// y se refresca el estado de cada libro con GET /libros/{id}. Devuelve la lista nueva, o null si no hay nada que actualizar.
export const traerPublicaciones = async (locales, catalogo) => {
  const mios = await getMisLibrosApi()
  if (mios) {
    const previas = new Map(locales.map((p) => [p.id, p]))
    return Promise.all(mios.map(async (l) => {
      const p = desdeBack(l, previas.get(l.id), catalogo)
      if (!p.imgs.length) p.imgs = await getImagenesApi(l.id).catch(() => [])
      return p
    }))
  }
  if (!locales.length) return null
  const libros = await Promise.all(locales.map((p) => getLibroApi(p.id).catch(() => null)))
  const porId = new Map(libros.filter(Boolean).map((l) => [l.id, l]))
  if (!porId.size) return null
  return locales.map((p) => (porId.has(p.id) ? desdeBack(porId.get(p.id), p, catalogo) : p))
}
