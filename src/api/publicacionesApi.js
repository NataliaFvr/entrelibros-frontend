import { getImagenesApi, getMisLibrosApi } from './librosApi'
import { precioFinal, publicacionAFront } from './adaptadores'

// Publicaciones del vendedor en el formato del panel { id, t, a, ed, cat, idioma, anio, usado, base, d, stock, imgs, descripcion,
// estado: 'activo' | 'baja', mod: 'EN_REVISION' | 'ACEPTADO' | 'RECHAZADO' }. Solo se usa con el back.

// El DTO LibroMioResponse ya contiene categorías, estados y motivo de rechazo.
const desdeBack = (l) => {
  const publicacion = {
    ...l, mod: l.estadoModeracion, estado: publicacionAFront(l.estadoPublicacion), modC: l.motivoRechazo || '',
    imgs: [],
  }
  if (l.estadoModeracion === 'EN_REVISION' && l.snapshotTitulo != null) {
    publicacion.revision = {
      ...publicacion,
      t: l.snapshotTitulo, a: l.snapshotAutor, ed: l.snapshotEditorial, anio: l.snapshotAnio,
      idioma: l.snapshotIdioma, usado: l.snapshotEstadoLibro === 'USADO', base: l.snapshotPrecio,
      d: l.snapshotDescuentoPct, p: precioFinal(l.snapshotPrecio, l.snapshotDescuentoPct), stock: l.snapshotStock,
      descripcion: l.snapshotDescripcion,
    }
  }
  return publicacion
}

export const traerPublicaciones = async () => {
  const mios = await getMisLibrosApi()
  return Promise.all(mios.map(async (l) => {
    const p = desdeBack(l)
    p.imgs = await getImagenesApi(l.id).catch(() => [])
    return p
  }))
}
