import { solicitudAFront } from './adaptadores'

export const enRevision = (p) => p.estadoModeracion === 'EN_REVISION' || p.mod === 'EN_REVISION' || Boolean(p.revision)
export const precioFinal = (p) => Math.round(p.base * (1 - p.d / 100) * 100) / 100

export const getVendedor = (u) => ({
  estado: u.rol === 'VENDEDOR' ? 'aprobado' : solicitudAFront(u.estadoSolicitud) === 'pendiente' ? 'pendiente' : 'ninguno',
  tienda: u.tienda || `${u.nombre} ${u.apellido}`,
  prov: u.provincia || '',
  pub: [],
})

export const tiendaDe = (u) => {
  if (!u || u.rol !== 'VENDEDOR') return null
  return u.tienda || `${u.nombre} ${u.apellido}`
}

export const libroEnRevision = (u, libro) => Boolean(u && libro && libro.vId === u.id && enRevision(libro))
export const esLibroPropio = (u, libro) => Boolean(u && libro && libro.vId != null && libro.vId === u.id)
export const rutaEdicion = (u, libro) => (esLibroPropio(u, libro) ? `/vender/editar/${libro.id}` : '/vender')
