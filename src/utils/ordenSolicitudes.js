// Orden de atención de la cola de moderación: las más viejas primero (FIFO).
// Se ordena por `fechaSolicitud` cuando el servidor la informa; si falta (hoy LibroResponse no la trae),
// por el id, que crece con cada publicación.

const marca = (s) => (s.fechaSolicitud ? Date.parse(s.fechaSolicitud) : NaN)
const numeroDeId = (s) => Number(String(s.id).replace(/\D/g, '')) || 0

export const masViejasPrimero = (solicitudes) => {
  // Se usa la fecha solo si TODAS la tienen: mezclar fechas e ids daría un orden incoherente
  const porFecha = solicitudes.length > 0 && solicitudes.every((s) => !Number.isNaN(marca(s)))
  const clave = porFecha ? marca : numeroDeId
  return [...solicitudes].sort((a, b) => clave(a) - clave(b) || numeroDeId(a) - numeroDeId(b))
}
