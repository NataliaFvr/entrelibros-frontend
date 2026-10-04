import { guardar, leer } from './almacen'
import { claveNotifs } from './claves'
import { notificacionesIniciales } from '../data/notificacionesMock'

// Notificaciones por cuenta, guardadas en este navegador. La primera vez se siembran con las de ejemplo.
// Back: GET /notificaciones, PATCH /notificaciones/{id}/leida, PATCH /notificaciones/leidas, DELETE /notificaciones/{id}
export const getNotificaciones = (u) => {
  const guardadas = leer(claveNotifs(u), null)
  if (guardadas) return guardadas
  const semilla = notificacionesIniciales(u)
  guardar(claveNotifs(u), semilla)
  return semilla
}

export const guardarNotificaciones = (u, lista) => guardar(claveNotifs(u), lista)
