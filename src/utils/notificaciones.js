// A dónde lleva cada notificación del back (TipoNotificacion). Devuelve null si no hay destino útil
// (por ejemplo las que no traen `tipo`, o VENDEDOR_RECHAZADO).
export const rutaNotificacion = ({ tipo, idLibro } = {}) => {
  switch (tipo) {
    case 'LIBRO_ACEPTADO': return idLibro != null ? `/libro/${idLibro}` : '/vender'
    case 'LIBRO_RECHAZADO': return idLibro != null ? `/vender/editar/${idLibro}` : '/vender'
    case 'VENDEDOR_APROBADO': return '/vender'
    case 'VENTA_REALIZADA': return '/vender/ventas'
    case 'COMPRA_CONFIRMADA':
    case 'PAGO_PROCESADO': return '/cuenta'
    case 'LIBRO_PENDIENTE_REVISION': return '/admin/moderacion'
    case 'SOLICITUD_VENDEDOR_PENDIENTE': return '/admin/usuarios'
    default: return null
  }
}
