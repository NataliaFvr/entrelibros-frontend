import { plural } from './format'

const MIN = 60000
const HORA = 60 * MIN
const DIA = 24 * HORA

// 1699999999999 -> "Hace 5 min" · "Hace 2 horas" · "Hace 3 días" · "04/10/2026" (pasada una semana)
export const tiempoRelativo = (fecha, ahora = Date.now()) => {
  const dif = Math.max(0, ahora - fecha)
  if (dif < MIN) return 'Recién'
  if (dif < HORA) return `Hace ${Math.floor(dif / MIN)} min`
  if (dif < DIA) {
    const h = Math.floor(dif / HORA)
    return `Hace ${h} ${plural(h, 'hora', 'horas')}`
  }
  if (dif < 7 * DIA) {
    const d = Math.floor(dif / DIA)
    return `Hace ${d} ${plural(d, 'día', 'días')}`
  }
  return new Date(fecha).toLocaleDateString('es-AR')
}
