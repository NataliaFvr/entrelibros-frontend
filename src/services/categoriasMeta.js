import { guardar, leer } from './almacen'

// Datos extra de las categorías que el back no tiene (foto y baja lógica), guardados en el navegador por nombre:
// { [nombre]: { imagen: dataUrl|'', activa: boolean } }
export const CLAVE_META_CATEGORIAS = 'entrelibros_catmeta'
export const SIN_ESPACIO = 'No pudimos guardar: sin espacio en el navegador.'

export const leerMeta = () => {
  const m = leer(CLAVE_META_CATEGORIAS, {})
  return m && typeof m === 'object' && !Array.isArray(m) ? m : {}
}
export const guardarMeta = (m) => { if (!guardar(CLAVE_META_CATEGORIAS, m)) throw new Error(SIN_ESPACIO) }

// Nombres de categorías dadas de baja (el catálogo y los formularios no las ofrecen)
export const categoriasInactivas = () => new Set(Object.entries(leerMeta()).filter(([, v]) => v && v.activa === false).map(([n]) => n))

// { nombre: dataUrl } de las categorías con foto (para la grilla del inicio)
export const imagenesDeCategorias = () =>
  Object.fromEntries(Object.entries(leerMeta()).filter(([, v]) => v && v.imagen).map(([n, v]) => [n, v.imagen]))
