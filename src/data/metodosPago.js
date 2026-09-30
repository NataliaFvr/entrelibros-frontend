// [clave, título, detalle]
export const METODOS = [
  ['tarjeta', 'Tarjeta de crédito o débito', 'Visa, Mastercard, American Express'],
  ['mercadopago', 'Mercado Pago', 'Pagá con tu cuenta o dinero disponible'],
  ['transferencia', 'Transferencia bancaria', 'Se acredita al instante (simulado)'],
]

export const nombreMetodo = (clave) => (METODOS.find((m) => m[0] === clave) || [0, clave])[1]
