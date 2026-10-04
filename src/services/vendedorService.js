import { leer, guardar } from './almacen'
import { claveVendedor } from './claves'
import { getUsuarios } from './authService'
import { TONES } from '../utils/colors'
import { SEMILLA_VENDEDOR_ALEPH, VENDEDOR_ALEPH } from '../data/vendedorPruebaMock'

// Datos de vendedor por cuenta, guardados en este navegador.
// estado: 'ninguno' | 'pendiente' | 'aprobado'. Cada libro: { id, t, a, ed, cat, idioma, anio, usado, base, d, stock,
// estado: 'activo' | 'baja', mod: 'EN_REVISION' | 'ACEPTADO' | 'RECHAZADO' }.
// Back: la solicitud y la moderación de libros las resuelve un administrador.
// Una publicación está "en revisión" si es nueva y aún no fue aceptada, o si ya aceptada tiene una modificación
// pendiente (`revision` = datos nuevos a la espera del administrador). Mientras tanto el catálogo sigue mostrando
// los datos ya aprobados. Back: EstadoModeracion = PENDIENTE (HistorialModeracion registra la decisión).
export const enRevision = (p) => p.mod === 'EN_REVISION' || Boolean(p.revision)

export const precioFinal = (p) => Math.round(p.base * (1 - p.d / 100))

// La cuenta con rol VENDEDOR ya viene aprobada; el resto empieza sin solicitud
// y @vendedor_prueba ("Librería El Aleph") arranca con sus publicaciones de ejemplo
const inicial = (u) => {
  if (u.nombreUsuario === VENDEDOR_ALEPH.nombreUsuario) return structuredClone(SEMILLA_VENDEDOR_ALEPH)
  return u.rol === 'VENDEDOR'
    ? { estado: 'aprobado', tienda: u.tienda || `${u.nombre} ${u.apellido}`, prov: u.prov || 'Buenos Aires', pub: [] }
    : { estado: 'ninguno', pub: [] }
}

export const getVendedor = (u) => leer(claveVendedor(u), null) || inicial(u)
export const guardarVendedor = (u, v) => guardar(claveVendedor(u), v) // true si se pudo guardar

const aLibro = (p, v) => ({
  id: p.id, t: p.t, a: p.a, ed: p.ed, idioma: p.idioma, anio: p.anio, base: p.base, d: p.d, p: precioFinal(p),
  usado: p.usado, cat: p.cat, v: v.tienda, envio: v.prov === 'Buenos Aires' ? 'misma' : 'distinta',
  ventas: 0.5, stock: p.stock, imgs: p.imgs || [], c: TONES[(p.t.length + p.a.length) % TONES.length],
})

// Tienda de la cuenta si ya es vendedor aprobado; si no, null
export const tiendaDe = (u) => {
  if (!u) return null
  const v = getVendedor(u)
  return v.estado === 'aprobado' ? v.tienda : null
}

// ¿La publicación de la cuenta que corresponde a este libro del catálogo está en revisión?
export const libroEnRevision = (u, libro) => {
  if (!u || !libro) return false
  const p = getVendedor(u).pub.find((x) => x.id === libro.id)
  return Boolean(p && enRevision(p))
}

// ¿Este libro del catálogo es una publicación de la cuenta? (libro.v = nombre de la tienda)
export const esLibroPropio = (u, libro) => {
  const tienda = tiendaDe(u)
  return Boolean(tienda && libro && libro.v === tienda)
}

// Pantalla para editar un libro propio. Los libros de ejemplo fijos no están en las publicaciones
// del vendedor y no se pueden editar: ahí se lo lleva a "Mis libros".
export const rutaEdicion = (u, libro) =>
  getVendedor(u).pub.some((p) => p.id === libro.id) ? `/vender/editar/${libro.id}` : '/vender'

// Libros de todos los vendedores que están activos y aceptados: entran al catálogo
export const librosPublicados = () =>
  getUsuarios().flatMap((u) => {
    const v = getVendedor(u)
    if (v.estado !== 'aprobado') return []
    return v.pub.filter((p) => p.estado === 'activo' && p.mod === 'ACEPTADO').map((p) => aLibro(p, v))
  })

// Ids de todas las publicaciones que gestiona un vendedor (activas o no). El catálogo de ejemplo no debe
// mostrar su versión fija de esos libros: manda lo que el vendedor tiene en su panel (si lo dio de baja, desaparece).
export const idsGestionados = () =>
  new Set(getUsuarios().flatMap((u) => {
    const v = getVendedor(u)
    return v.estado === 'aprobado' ? v.pub.map((p) => p.id) : []
  }))
