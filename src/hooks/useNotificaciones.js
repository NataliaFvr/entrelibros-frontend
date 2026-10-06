import { useCallback, useEffect, useMemo, useState } from 'react'
import { getNotificaciones, guardarNotificaciones } from '../services/notificacionesService'
import { guardar, leer } from '../services/almacen'
import { claveNotifs } from '../services/claves'
import { listarNotificacionesApi, marcarTodasLeidasApi } from '../api/cuentaApi'
import { USAR_API } from '../utils/modoApi'

const CADA = 60000 // con el back se vuelve a pedir la lista cada minuto

// Con el back el servidor solo sabe "marcar TODAS como leídas" (PATCH /notificaciones/marcar-leidas): marcar una sola
// o descartar una se recuerda en este navegador (ids), sin perder el resto.
const estadoLocal = (u) => {
  const g = leer(claveNotifs(u), null)
  return g && !Array.isArray(g) ? { leidas: g.leidas || [], ocultas: g.ocultas || [] } : { leidas: [], ocultas: [] }
}

// Notificaciones de la cuenta `user`: [{ id, texto, fecha, leida }]. Cada cambio se guarda solo.
const useNotificacionesDemo = (user) => {
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

const useNotificacionesApi = (user) => {
  const [servidor, setServidor] = useState([])
  const [local, setLocal] = useState(() => estadoLocal(user))

  const traer = useCallback(() => listarNotificacionesApi().then(setServidor).catch(() => {}), [])
  useEffect(() => {
    traer()
    const t = setInterval(traer, CADA)
    return () => clearInterval(t)
  }, [traer])

  const lista = useMemo(
    () => servidor.filter((n) => !local.ocultas.includes(n.id)).map((n) => (n.leida || local.leidas.includes(n.id) ? { ...n, leida: true } : n)),
    [servidor, local],
  )

  const cambiarLocal = (nuevo) => {
    setLocal(nuevo)
    guardar(claveNotifs(user), nuevo)
  }

  const marcarLeida = (id) => cambiarLocal({ ...local, leidas: [...local.leidas, id] })
  const descartar = (id) => cambiarLocal({ ...local, ocultas: [...local.ocultas, id] })
  const marcarTodas = async () => {
    setServidor((s) => s.map((n) => ({ ...n, leida: true })))
    try { await marcarTodasLeidasApi() } catch { traer() }
  }

  return { lista, noLeidas: lista.filter((n) => !n.leida).length, marcarLeida, marcarTodas, descartar }
}

// El modo se decide una sola vez por build (VITE_API): no cambia entre renders, así que los hooks siempre se llaman en el mismo orden
const useNotificaciones = USAR_API ? useNotificacionesApi : useNotificacionesDemo

export default useNotificaciones
