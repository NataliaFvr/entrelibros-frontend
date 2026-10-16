// [texto, clase de la etiqueta]
export const ETIQUETAS_PAGO = {
  PENDIENTE: ['Pendiente de pago', ''],
  SIMULADO_APROBADO: ['Pagada', 'used'],
  RECHAZADO: ['Pago rechazado', 'off'],
  CANCELADO: ['Cancelada', 'off'],
  VENCIDO: ['Reserva vencida', 'off'],
}

// El estado solo lo informa el backend. La cuenta regresiva se muestra como información visual,
// pero no cambia localmente si una reserva sigue pendiente o ya venció.
export const estadoPago = (pedido) => pedido.pago || 'SIMULADO_APROBADO'
