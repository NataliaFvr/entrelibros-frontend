import { leer, guardar } from './almacen'
import { claveVendedor } from './claves'
import { getUsuarios } from './authService'
import { TONES } from '../utils/colors'
import { SEMILLA_VENDEDOR_ALEPH, VENDEDOR_ALEPH } from '../data/vendedorPruebaMock'
import { solicitudAFront } from '../utils/adaptadores'
import { USAR_API } from '../utils/modoApi'

// Datos de vendedor por cuenta, guardados en este navegador.
// estado: 'ninguno' | 'pendiente' | 'aprobado'. Cada libro: { id, t, a, ed, cat, idioma, anio, usado, base, d, stock,
// estado: 'activo' | 'baja', mod: 'EN_REVISION' | 'ACEPTADO' | 'RECHAZADO' }.
// Back: la solicitud y la moderación de libros las resuelve un administrador.
// Una publicación está "en revisión" si es nueva y aún no fue aceptada, o si ya aceptada tiene una modificación
// pendiente (`revision` = datos nuevos a la espera del administrador). Igual que el back, editar un libro aceptado lo
// pasa a EN_REVISION y lo saca del catálogo hasta que el administrador lo apruebe (HistorialModeracion registra la decisión).
export const enRevision = (p) => p.mod === 'EN_REVISION' || Boolean(p.revision)

// Precio con descuento, redondeado a centavos (el precio admite hasta 2 decimales)
export const precioFinal = (p) => Math.round(p.base * (1 - p.d / 100) * 100) / 100

// La cuenta con rol VENDEDOR ya viene aprobada; el resto empieza sin solicitud
// y @vendedor_prueba ("Librería El Aleph") arranca con sus publicaciones de ejemplo
const inicial = (u) => {
  if (u.nombreUsuario === VENDEDOR_ALEPH.nombreUsuario) return structuredClone(SEMILLA_VENDEDOR_ALEPH)
  return u.rol === 'VENDEDOR'
    ? { estado: 'aprobado', tienda: u.tienda || `${u.nombre} ${u.apellido}`, prov: u.prov || 'Buenos Aires', pub: [] }
    : { estado: 'ninguno', pub: [] }
}

// Con el back, el estado de la tienda sale del usuario (rol VENDEDOR / estadoSolicitudVendedor PENDIENTE) y no de lo guardado acá.
// Lo que el back no guarda (teléfono, descripción) y la lista de publicaciones del panel sí se conservan en este navegador.
const conEstadoDelBack = (g, u) => ({
  ...g,
  estado: u.rol === 'VENDEDOR' ? 'aprobado' : solicitudAFront(u.estadoSolicitud) === 'pendiente' ? 'pendiente' : 'ninguno',
  tienda: u.tienda || g.tienda || `${u.nombre} ${u.apellido}`,
  prov: u.provincia || g.prov || 'Buenos Aires',
})

export const getVendedor = (u) => {
  const guardado = leer(claveVendedor(u), null) || inicial(u)
  return USAR_API ? conEstadoDelBack(guardado, u) : guardado
}
export const guardarVendedor = (u, v) => guardar(claveVendedor(u), v) // true si se pudo guardar

const aLibro = (p, v) => ({
  id: p.id, t: p.t, a: p.a, ed: p.ed, idioma: p.idioma, anio: p.anio, base: p.base, d: p.d, p: precioFinal(p),
  usado: p.usado, cat: p.cat, cats: p.cats, v: v.tienda, envio: v.prov === 'Buenos Aires' ? 'misma' : 'distinta',
  ventas: 0.5, stock: p.stock, imgs: p.imgs || [], descripcion: p.descripcion || '', c: TONES[(p.t.length + p.a.length) % TONES.length],
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
  // Con el back el dueño se identifica por id (LibroResponse.idVendedor): el nombre que informa el back es el del vendedor, no el de la tienda
  if (USAR_API) return Boolean(u && libro && libro.vId != null && libro.vId === u.id)
  const tienda = tiendaDe(u)
  return Boolean(tienda && libro && libro.v === tienda)
}

// Pantalla para editar un libro propio. Los libros de ejemplo fijos no están en las publicaciones
// del vendedor y no se pueden editar: ahí se lo lleva a "Mis libros".
export const rutaEdicion = (u, libro) =>
  getVendedor(u).pub.some((p) => p.id === libro.id) ? `/vender/editar/${libro.id}` : '/vender'

// Id nuevo y único para una publicación: mayor que cualquier id ya usado (propias de cualquier vendedor y de ejemplo),
// así /libro/:id nunca apunta a un libro o a reseñas preexistentes. Back: lo asigna la base de datos.
export const nuevoIdPublicacion = () => {
  const usados = getUsuarios().flatMap((u) => getVendedor(u).pub.map((p) => p.id))
  return Math.max(Date.now(), ...usados) + 1
}

// Libros de todos los vendedores que están activos y aceptados y SIN revisión pendiente: entran al catálogo.
// Un libro editado (con `revision`) sale del catálogo hasta que el administrador lo apruebe.
export const librosPublicados = () =>
  getUsuarios().flatMap((u) => {
    const v = getVendedor(u)
    // Un vendedor dado de baja por el administrador deja de mostrar sus libros
    if (v.estado !== 'aprobado' || u.estado === 'DADO_DE_BAJA') return []
    return v.pub.filter((p) => p.estado === 'activo' && p.mod === 'ACEPTADO' && !enRevision(p)).map((p) => aLibro(p, v))
  })

// Ids de todas las publicaciones que gestiona un vendedor (activas o no). El catálogo de ejemplo no debe
// mostrar su versión fija de esos libros: manda lo que el vendedor tiene en su panel (si lo dio de baja, desaparece).
export const idsGestionados = () =>
  new Set(getUsuarios().flatMap((u) => {
    const v = getVendedor(u)
    return v.estado === 'aprobado' ? v.pub.map((p) => p.id) : []
  }))
