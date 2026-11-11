import { getMisLibrosApi } from './librosApi'
import { publicacionAFront } from './adaptadores'

// Publicaciones del vendedor en el formato del panel { id, t, a, ed, cat, idioma, anio, usado, base, d, stock, imgs, descripcion,
// estado: 'activo' | 'baja', mod: 'EN_REVISION' | 'ACEPTADO' | 'RECHAZADO' }. Solo se usa con el back.

// El DTO LibroMioResponse ya contiene categorías, estados y motivo de rechazo.
const desdeBack = (l) => {
  const publicacion = {
    ...l, mod: l.estadoModeracion, estado: publicacionAFront(l.estadoPublicacion), modC: l.motivoRechazo || '',
    // En la lista alcanza con la portada (ya viene en la respuesta); todas las fotos se piden recién al editar el libro
    imgs: l.imgs || [], fotosCompletas: false,
  }
  if (l.estadoModeracion === 'EN_REVISION' && l.snapshotTitulo != null) {
    publicacion.revision = {
      ...publicacion,
      t: l.snapshotTitulo, a: l.snapshotAutor, ed: l.snapshotEditorial, anio: l.snapshotAnio,
      idioma: l.snapshotIdioma, usado: l.snapshotEstadoLibro === 'USADO', base: l.snapshotPrecio,
      d: l.snapshotDescuentoPct, p: l.snapshotPrecioFinal ?? l.snapshotPrecio, stock: l.snapshotStock,
      descripcion: l.snapshotDescripcion,
    }
  }
  return publicacion
}

export const traerPublicaciones = async () => (await getMisLibrosApi()).map(desdeBack)
