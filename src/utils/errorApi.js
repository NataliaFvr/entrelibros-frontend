// Convierte cualquier error (axios o común) en un texto claro para mostrarle a la persona.
// Cubre los formatos habituales de Spring Boot: { message }, { error }, { errors: { campo: msg } } y
// { errors: [{ field, defaultMessage }] } (Bean Validation).
const POR_ESTADO = {
  400: 'Revisá los datos ingresados: hay información inválida.',
  401: 'Tu sesión venció. Volvé a ingresar para continuar.',
  403: 'No tenés permiso para realizar esta acción.',
  404: 'No encontramos lo que buscabas. Puede que ya no exista.',
  409: 'Este libro ya tiene una modificación pendiente de revisión.',
  422: 'Revisá los datos ingresados: hay información inválida.',
}

const textoDe = (d) => d.message || d.mensaje || d.error || ''

export const mensajeError = (err) => {
  const r = err && err.response
  if (!r) {
    if (err && err.request) return 'No pudimos conectarnos con el servidor. Revisá tu conexión e intentá de nuevo.'
    return (err && err.message) || 'Ocurrió un error inesperado. Intentá de nuevo.'
  }
  const d = r.data && typeof r.data === 'object' ? r.data : {}
  const campos = d.errors || d.errores
  if (campos) {
    const lista = Array.isArray(campos)
      ? campos.map((c) => (typeof c === 'string' ? c : c.defaultMessage || c.message || c.mensaje)).filter(Boolean)
      : Object.values(campos).map(String)
    if (lista.length) return lista.join(' ')
  }
  return textoDe(d) || POR_ESTADO[r.status] || (r.status >= 500 ? 'El servidor tuvo un problema. Intentá de nuevo en unos minutos.' : 'No pudimos completar la acción.')
}
