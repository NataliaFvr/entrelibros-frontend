import { useState } from 'react'
import { getNotificaciones, guardarNotificaciones } from '../services/notificacionesService'

// Notificaciones de la cuenta `user`: [{ id, texto, fecha, leida }]. Cada cambio se guarda solo.
const useNotificaciones = (user) => {
  const [lista, setLista] = useState(() => getNotificaciones(user))

  const cambiar = (nueva) => {
    setLista(nueva)
    guardarNotificaciones(user, nueva)
  }

  const marcarLeida = (id) => cambiar(lista.map((n) => (n.id === id ? { ...n, leida: true } : n)))
  const marcarTodas = () => cambiar(lista.map((n) => ({ ...n, leida: true })))
  const descartar = (id) => cambiar(lista.filter((n) => n.id !== id))

  return { lista, noLeidas: lista.filter((n) => !n.leida).length, marcarLeida, marcarTodas, descartar }
}

export default useNotificaciones
