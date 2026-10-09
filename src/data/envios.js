// Los dos tipos de envío y sus textos: una sola fuente para la página pública de Políticas de envío y la del administrador.
// `tipo` coincide con la clave de las tarifas de envío; `variante` cambia el color del borde de la tarjeta.
export const TIPOS_ENVIO = [
  { tipo: 'misma', titulo: 'Misma provincia que el vendedor', variante: '', texto: 'Si vivís en la misma provincia que quien vende el libro, el envío tiene este precio.', textoAdmin: 'Si el comprador vive en la misma provincia que quien vende el libro, el envío tiene este precio.' },
  { tipo: 'distinta', titulo: 'Distinta provincia', variante: 'd', texto: 'Si el vendedor está en otra provincia, el envío tiene este precio.', textoAdmin: 'Si el vendedor está en otra provincia, el envío tiene este precio.' },
]
