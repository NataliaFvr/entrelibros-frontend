import { TONES } from './colors'

// Traductores BACK -> FRONT (y de vuelta). El front trabaja con su propio modelo (libro: t, a, ed, base, d, p, usado…;
// pedido: n, its, sub, env…) y el back con sus DTOs. Todo el conocimiento de los nombres del back vive acá:
// si un DTO cambia, se ajusta SOLO este archivo.

/* ---------------- Enums ---------------- */

// EstadoSolicitudVendedor (NINGUNO | PENDIENTE | APROBADO) <-> estado de la tienda del front
const SOLICITUD = { NINGUNO: 'ninguno', PENDIENTE: 'pendiente', APROBADO: 'aprobado' }
export const solicitudAFront = (e) => SOLICITUD[e] || 'ninguno'

// EstadoPublicacion (ACTIVA | DADA_DE_BAJA) <-> estado de la publicación del front
export const publicacionAFront = (e) => (e === 'DADA_DE_BAJA' ? 'baja' : 'activo')

/* ---------------- Direcciones ---------------- */

// DireccionResponse { id, alias, calle, ciudad, provincia, cp, principal } -> dirección del front (provincia -> prov).
// El back garantiza que, si hay direcciones, exactamente una viene con principal = true: el front no lo recalcula.
export const aDireccionFront = (d) => ({
  id: d.id,
  alias: d.alias,
  calle: d.calle,
  ciudad: d.ciudad,
  prov: d.provincia,
  cp: d.cp || '',
  principal: Boolean(d.principal),
})

/* ---------------- Fechas ---------------- */

// LocalDateTime del back ("2026-10-04T12:00:00", sin zona) -> milisegundos. Se lee como hora local del navegador.
export const isoAMs = (iso) => {
  if (!iso) return null
  const ms = new Date(iso).getTime()
  return Number.isNaN(ms) ? null : ms
}

// "2026-10-04T12:00:00" -> "2026-10-04" (el front guarda fechas de pedidos como día)
export const isoADia = (iso) => (iso ? String(iso).slice(0, 10) : '')

/* ---------------- Libros ---------------- */

export const precioFinal = (base, descuentoPct) => Math.round(base * (1 - (descuentoPct || 0) / 100) * 100) / 100

// LibroResponse -> libro del front. Lo que el back todavía no informa queda con un valor neutro (cat, envio, ventas, imgs):
// librosApi los completa cuando puede (categorías por filtro, ranking de ventas, imágenes por libro).
export const aLibroFront = (l) => {
  const base = l.precio ?? 0
  const d = l.descuentoPct ?? 0
  const t = l.titulo || ''
  const a = l.autor || ''
  return {
    id: l.id, t, a, ed: l.editorial || '', idioma: l.idioma || '', anio: l.anio ?? 0,
    base, d, p: precioFinal(base, d), usado: l.estadoLibro === 'USADO',
    cat: '', v: l.nombreVendedor || '', vId: l.idVendedor ?? null, envio: 'distinta', ventas: 0,
    stock: l.stock ?? 0, imgs: [], descripcion: l.descripcion || '',
    c: TONES[(t.length + a.length) % TONES.length],
    estadoPublicacion: l.estadoPublicacion, estadoModeracion: l.estadoModeracion,
  }
}

/* ---------------- Usuarios ---------------- */

// UsuarioResponse -> usuario del front. `id` es el id numérico del back; `nombreUsuario` sigue siendo la clave de lo local.
export const aUsuarioFront = (u) => ({
  id: u.id, nombreUsuario: u.nombreUsuario, nombre: u.nombre || '', apellido: u.apellido || '', email: u.email || '',
  rol: u.rol, estado: u.estado || 'ACTIVO', provincia: u.provincia || '', tienda: u.nombreTienda || '',
  estadoSolicitud: u.estadoSolicitudVendedor || 'NINGUNO', verificado: true,
})

/* ---------------- Notificaciones ---------------- */

// NotificacionResponse { id, tipo, mensaje, leida, fecha, idLibro } -> { id, texto, fecha(ms), leida }
export const aNotificacionFront = (n) => ({
  id: String(n.id), texto: n.mensaje, fecha: isoAMs(n.fecha) ?? Date.now(), leida: Boolean(n.leida), tipo: n.tipo, idLibro: n.idLibro ?? null,
})

/* ---------------- Reseñas ---------------- */

const inicial = (apellido) => (apellido ? ` ${String(apellido).trim()[0]}.` : '')

// ResenaLibroResponse { id, calificacion, comentario, fecha, idLibro, nombreComprador, apellidoComprador }
export const aReseniaLibroFront = (r) => ({
  id: r.id, i: r.id, st: r.calificacion, t: r.comentario || '', date: r.fecha, u: `${r.nombreComprador || ''}${inicial(r.apellidoComprador)}`.trim(), idLibro: r.idLibro,
})

// ResenaVendedorResponse { id, clasificacion, comentario, fecha, idPago, idVendedor, nombreComprador }
export const aReseniaVendedorFront = (r) => ({
  id: r.id, st: r.clasificacion, t: r.comentario || '', date: r.fecha, u: r.nombreComprador || '', nc: r.nombreComprador || '', libro: '',
})

/* ---------------- Pedidos ---------------- */

// El front manda "Ciudad Autónoma de Buenos Aires" (con tildes); el back compara contra "CABA" o "CIUDAD AUTONOMA DE BUENOS AIRES"
// (sin tildes) para elegir la zona de envío. Se manda siempre "CABA" para que no caiga por error en RESTO_PAIS.
export const provinciaParaBack = (prov = '') => (/^(ciudad aut[oó]noma de buenos aires|caba)$/i.test(prov.trim()) ? 'CABA' : prov.trim())

// OrdenResponse (con items) -> pedido del front { n, date, its, addr, sub, env, total, est, pago, reserva, proveedor }
const ESTADO_TEXTO = { PENDIENTE: 'Pendiente', SIMULADO_APROBADO: 'Confirmada', RECHAZADO: 'Rechazada', CANCELADO: 'Cancelada', VENCIDO: 'Vencida' }

export const aPedidoFront = (o) => ({
  n: String(o.id), idOrden: o.id, date: isoADia(o.fecha),
  its: (o.items || []).map((i) => ({ id: i.idLibro, q: i.cantidad, p: i.precioUnitario, t: i.tituloLibro, idItem: i.idOrdenItem, idVendedor: i.idVendedor })),
  addr: o.provinciaDestino || '', sub: o.subtotal ?? 0, env: o.costoEnvio ?? 0,
  est: ESTADO_TEXTO[o.estadoPago] || o.estadoPago, pago: o.estadoPago,
  reserva: o.estadoPago === 'PENDIENTE' ? isoAMs(o.reservaHasta) ?? undefined : undefined,
  comprador: `${o.nombreComprador || ''}`.trim(),
})

/* ---------------- Imágenes ---------------- */

// dataURL (las fotos del formulario van en base64) -> File para el multipart de POST /imagenes-libro
export const dataUrlAFile = async (dataUrl, nombre = 'foto') => {
  const blob = await (await fetch(dataUrl)).blob()
  const ext = blob.type === 'image/png' ? 'png' : 'jpg'
  return new File([blob], `${nombre}.${ext}`, { type: blob.type || 'image/jpeg' })
}
