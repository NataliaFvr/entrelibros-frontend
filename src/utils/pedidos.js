export const RESERVA_MS = 60 * 60000 // los libros quedan reservados 1 hora

// [texto, clase de la etiqueta]
export const ETIQUETAS_PAGO = {
  PENDIENTE: ['Pendiente de pago', ''],
  SIMULADO_APROBADO: ['Pagada', 'used'],
  RECHAZADO: ['Pago rechazado', 'off'],
  CANCELADO: ['Cancelada', 'off'],
  VENCIDO: ['Reserva vencida', 'off'],
}

// Estado real del pago: un pendiente con la reserva pasada cuenta como vencido
export const estadoPago = (pedido, ahora = Date.now()) => {
  const pago = pedido.pago || 'SIMULADO_APROBADO'
  return pago === 'PENDIENTE' && pedido.reserva && pedido.reserva <= ahora ? 'VENCIDO' : pago
}

export const subtotal = (items) => items.reduce((suma, i) => suma + i.p * i.q, 0)
