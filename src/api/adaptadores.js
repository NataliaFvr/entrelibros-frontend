import { TONES } from '../utils/colors'
import { destinoTexto } from '../utils/format'
import { RAIZ } from './axiosConfig'

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

// DireccionResponse { id, alias, calle, ciudad, provincia, cp, principal } -> dirección del front.
export const aDireccionFront = (d) => ({
  id: d.id,
  alias: d.alias,
  calle: d.calle,
  ciudad: d.ciudad,
  prov: d.provincia,
  cp: d.cp || '',
  principal: d.principal === true,
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

// LibroResponse -> libro del front. Lo que el back todavía no informa queda con un valor neutro (cat, envio, ventas, imgs):
// librosApi los completa cuando puede (categorías por filtro, ranking de ventas, imágenes por libro).
export const aLibroFront = (l) => {
  const base = l.precio ?? 0
  const t = l.titulo || ''
  const a = l.autor || ''
  // Si el back manda `categorias` (lista de { id, nombre } o de nombres) se usan en ese orden; si no, las completa getLibrosApi
  const cats = Array.isArray(l.categorias) ? l.categorias.map((c) => (typeof c === 'string' ? c : c && c.nombre)).filter(Boolean) : []
  return {
    id: l.id, t, a, ed: l.editorial || '', idioma: l.idioma || '', anio: l.anio ?? 0,
    base, d: l.descuentoPct ?? 0, p: l.precioFinal ?? l.precio ?? 0, usado: l.estadoLibro === 'USADO',
    cat: cats[0] || '', cats, v: l.nombreTienda || l.nombreVendedor || '', vId: l.idVendedor ?? null,
    provV: l.provinciaVendedor || '', envio: l.envio || 'distinta', ventas: l.vendidos ?? 0,
    stock: l.stock ?? 0, imgs: l.portada ? [`${RAIZ}${l.portada}`] : [], descripcion: l.descripcion || '',
    c: TONES[(t.length + a.length) % TONES.length],
    estadoPublicacion: l.estadoPublicacion, estadoModeracion: l.estadoModeracion,
    motivoRechazo: l.motivoRechazo || '',
  }
}

/* ---------------- Usuarios ---------------- */

// UsuarioResponse -> usuario del front. `id` es el id numérico del back; `nombreUsuario` sigue siendo la clave de lo local.
// `avatar` = clave del avatar por defecto elegido ('' = ninguno); `tieneFoto` = hay una foto subida (GET /usuarios/{id}/foto).
// No hay `verificado`: el back no deja iniciar sesión a una cuenta sin verificar (403 email_no_verificado), así que
// cualquier usuario que llega hasta acá ya está verificado.
export const aUsuarioFront = (u) => ({
  id: u.id, nombreUsuario: u.nombreUsuario, nombre: u.nombre || '', apellido: u.apellido || '', email: u.email || '',
  rol: u.rol, estado: u.estado || 'ACTIVO', provincia: u.provincia || '', tienda: u.nombreTienda || '',
  estadoSolicitud: u.estadoSolicitudVendedor || 'NINGUNO',
  avatar: u.avatar || '', tieneFoto: Boolean(u.tieneFoto),
})

/* ---------------- Notificaciones ---------------- */

// NotificacionResponse { id, tipo, mensaje, leida, fecha, idLibro, idOrden } -> { id, texto, fecha(ms), leida }
// El front usa el id como texto (key de React); al hablar con el back se vuelve número (idNotificacionApi).
export const aNotificacionFront = (n) => ({
  id: String(n.id), texto: n.mensaje, fecha: isoAMs(n.fecha) ?? Date.now(), leida: Boolean(n.leida), tipo: n.tipo,
  idLibro: n.idLibro ?? null, idOrden: n.idOrden ?? null,
})
export const idNotificacionApi = (id) => Number(id)

/* ---------------- Reseñas ---------------- */

const inicial = (apellido) => (apellido ? ` ${String(apellido).trim()[0]}.` : '')

// ResenaLibroResponse { id, calificacion, comentario, fecha, idLibro, nombreComprador, apellidoComprador }
export const aReseniaLibroFront = (r) => ({
  id: r.id, i: r.id, st: r.calificacion, t: r.comentario || '', date: r.fecha, idComprador: r.idComprador,
  u: `${r.nombreComprador || ''}${inicial(r.apellidoComprador)}`.trim(), idLibro: r.idLibro,
})

// ResenaVendedorResponse { id, clasificacion, comentario, fecha, idPago, idVendedor, nombreComprador }
export const aReseniaVendedorFront = (r) => ({
  id: r.id, st: r.clasificacion, t: r.comentario || '', date: r.fecha, idComprador: r.idComprador,
  u: r.nombreComprador || '', nc: r.nombreComprador || '', libro: r.libro || '',
})

/* ---------------- Carrito ---------------- */

// CarritoItemResponse { id, cantidad, idLibro, tituloLibro, precioUnitario, subtotal, maxCantidad } -> ítem del carrito.
// `id` es el id del LIBRO (así lo usa toda la interfaz); `idItem` es el id de la fila del carrito en el back, que piden
// PATCH y DELETE /carrito/items/{idItem}. El precio no se guarda acá: la pantalla lo toma del catálogo (con el descuento aplicado).
export const aItemCarritoFront = (i) => ({
  id: i.idLibro, q: i.cantidad, idItem: i.id, maxCantidad: i.maxCantidad, subtotal: i.subtotal ?? 0,
})

/* ---------------- Pedidos ---------------- */

// El front normaliza la provincia solo para el request; el backend calcula la zona y el costo real.
export const provinciaParaBack = (prov = '') => (/^(ciudad aut[oó]noma de buenos aires|caba)$/i.test(prov.trim()) ? 'CABA' : prov.trim())

// OrdenResponse (con items) -> pedido del front { n, date, its, addr, sub, env, total, est, pago, venceEn, proveedor }
const ESTADO_TEXTO = { PENDIENTE: 'Pendiente', SIMULADO_APROBADO: 'Confirmada', RECHAZADO: 'Rechazada', CANCELADO: 'Cancelada', VENCIDO: 'Vencida' }

// Dirección de entrega de la orden: el back la guarda copiada al hacer el checkout (calleDestino, ciudadDestino, cpDestino
// + provinciaDestino). Una orden vieja puede traer solo la provincia: en ese caso `calle` queda vacía y se muestra la provincia.
export const aDestinoFront = (o) => ({
  calle: o.calleDestino || '', ciudad: o.ciudadDestino || '', cp: o.cpDestino || '', prov: o.provinciaDestino || '',
})

export const aPedidoFront = (o) => {
  const dest = aDestinoFront(o)
  return {
    n: String(o.id), idOrden: o.id, date: isoADia(o.fecha),
    its: (o.items || []).map((i) => ({ id: i.idLibro, q: i.cantidad, p: i.precioUnitario, t: i.tituloLibro, idItem: i.idOrdenItem, idVendedor: i.idVendedor })),
    dest, addr: destinoTexto(dest), // addr = texto listo para mostrar: "calle, ciudad, Provincia (CP)"
    sub: o.subtotal ?? 0, env: o.costoEnvio ?? 0, total: o.total ?? 0,
    est: ESTADO_TEXTO[o.estadoPago] || o.estadoPago, pago: o.estadoPago,
    venceEn: o.estadoPago === 'PENDIENTE' ? isoAMs(o.venceEn) ?? undefined : undefined,
    comprador: `${o.nombreComprador || ''}`.trim(),
  }
}

/* ---------------- Envío ---------------- */

// EnvioResponse[] { id, zona: 'misma' | 'distinta', costoFijo } -> { misma: 1800, distinta: 3500, ids: { misma: 1, distinta: 2 } }
export const aTarifasEnvioFront = (lista = []) => ({
  ...Object.fromEntries(lista.map((e) => [e.zona, e.costoFijo])),
  ids: Object.fromEntries(lista.map((e) => [e.zona, e.id])),
})

// OrdenVendedorResponse ya incluye los ítems de esa venta, fecha, comprador y destino.
// -> { n, date, est, its, comprador }, el formato que consumen SellerSales y SaleCard.
export const aVentaFront = (ordenVendedor) => {
  if (ordenVendedor.estado === 'CANCELADA' || ordenVendedor.estadoPago !== 'SIMULADO_APROBADO') return null
  const its = (ordenVendedor.items || []).map((i) => ({
    t: i.tituloLibro || 'Libro', q: i.cantidad, p: i.precioUnitario,
    cat: (i.categorias || [])[0] || '', usado: i.estadoLibro === 'USADO',
  }))
  if (!its.length) return null
  return {
    n: String(ordenVendedor.idOrden), date: isoADia(ordenVendedor.fecha), est: ESTADO_TEXTO[ordenVendedor.estadoPago], its,
    comprador: `${ordenVendedor.nombreComprador || ''}`.trim(), destino: destinoTexto(aDestinoFront(ordenVendedor)),
  }
}

/* ---------------- Estadísticas del vendedor ---------------- */

// Desglose { nombre, unidades, ingresos } -> { nombre, unidades, ingresos } (sin nulos)
const aDesgloseFront = (d) => ({ nombre: d.nombre || 'Otros', unidades: d.unidades ?? 0, ingresos: d.ingresos ?? 0 })
const NOMBRE_ESTADO = { NUEVO: 'Nuevos', USADO: 'Usados' }

// EstadisticasVendedorResponse -> el modelo que muestra SellerStats.
// { ingresos, unidades, ventas, promedio, categorias: [...], estados: [...] }
export const aEstadisticasFront = (r) => ({
  ingresos: r.ingresosTotales ?? 0,
  unidades: r.unidadesVendidas ?? 0,
  ventas: r.cantidadVentas ?? 0,
  promedio: r.promedioPorVenta ?? 0,
  categorias: (r.ventasPorCategoria || []).map(aDesgloseFront),
  estados: (r.ventasPorEstado || []).map(aDesgloseFront).map((d) => ({ ...d, nombre: NOMBRE_ESTADO[d.nombre] || d.nombre })),
})

/* ---------------- Categorías ---------------- */

// Categoria { id, nombre } (GET /categorias) o CategoriaResponse { id, nombre, tieneImagen } -> { id, nombre, tieneImagen }.
// GET /categorias informa si existe una imagen activa para evitar pedidos innecesarios.
export const aCategoriaFront = (c) => ({ id: c.id, nombre: c.nombre, activa: c.activa !== false, tieneImagen: Boolean(c.tieneImagen) })

/* ---------------- Vendedor público ---------------- */

// GET /vendedores/{id} -> datos públicos del vendedor, incluida su reputación y su imagen de perfil.
export const aVendedorPublicoFront = (v) => {
  const id = v.id ?? v.idVendedor ?? null
  return {
  id,
  tienda: v.nombreTienda || v.tienda || [v.nombre, v.apellido].filter(Boolean).join(' ') || v.nombreUsuario || '',
  usuario: v.nombreUsuario || '',
  ubicacion: v.provincia || '',
  desde: (v.desde || v.fechaRegistro) ? String(v.desde || v.fechaRegistro).slice(0, 4) : '',
  descripcion: v.descripcion || '',
  promedioResenas: v.promedioResenas ?? 0,
  cantidadResenas: v.cantidadResenas ?? 0,
  tieneFoto: Boolean(v.tieneFoto),
  avatar: v.avatar || '',
  foto: v.tieneFoto && id != null ? `${RAIZ}/usuarios/${id}/foto` : '',
  verificado: true, // un vendedor listado es un vendedor aprobado por un administrador
  }
}

/* ---------------- Imágenes ---------------- */

// dataURL (las fotos del formulario van en base64) -> File para el multipart de POST /imagenes-libro
export const dataUrlAFile = async (dataUrl, nombre = 'foto') => {
  const blob = await (await fetch(dataUrl)).blob()
  const ext = blob.type === 'image/png' ? 'png' : 'jpg'
  return new File([blob], `${nombre}.${ext}`, { type: blob.type || 'image/jpeg' })
}
