import { useCallback, useEffect, useRef, useState } from 'react'
import { cantidadNoLeidasApi, eliminarNotificacionApi, listarPrimeraPaginaNotificacionesApi, marcarLeidaApi, marcarTodasLeidasApi } from '../api/cuentaApi'

const CADA = 60000 // con el back se consulta el contador cada minuto (liviano); la lista solo se pide si el contador cambió

// Con el back las notificaciones se gestionan por id: leer una (PATCH /{id}/leida), descartarla (DELETE /{id}) o marcar todas.
// El cambio se ve al instante y, si el servidor lo rechaza, se vuelve a pedir lo real.
// Carga liviana: la lista es solo la primera página (20 más nuevas) y el contador sale de GET /notificaciones/no-leidas/cantidad.
// Cada minuto solo se pide el contador; si cambió respecto del que tenemos, se vuelve a pedir la lista (también al abrir la campanita).
const useNotificacionesApi = () => {
  const [lista, setLista] = useState([])
  const [noLeidas, setNoLeidas] = useState(0)
  const conteo = useRef(0)
  const fijarConteo = useCallback((n) => { conteo.current = n; setNoLeidas(n) }, [])

  const traer = useCallback(async () => {
    try {
      const [primera, cantidad] = await Promise.all([listarPrimeraPaginaNotificacionesApi(), cantidadNoLeidasApi()])
      setLista(primera)
      fijarConteo(cantidad)
    } catch { /* se queda con lo que había */ }
  }, [fijarConteo])

  useEffect(() => {
    traer()
    const t = setInterval(async () => {
      try {
        if ((await cantidadNoLeidasApi()) !== conteo.current) traer()
      } catch { /* sin red por ahora */ }
    }, CADA)
    return () => clearInterval(t)
  }, [traer])

  // Aplica `cambio` a la lista ya, llama al back y, si falla, vuelve a pedir la lista real
  const aplicar = async (cambio, llamar) => {
    setLista(cambio)
    try { await llamar() } catch { traer() }
  }

  const marcarLeida = (id) => {
    if (lista.some((n) => n.id === id && !n.leida)) fijarConteo(Math.max(0, conteo.current - 1))
    return aplicar((l) => l.map((n) => (n.id === id ? { ...n, leida: true } : n)), () => marcarLeidaApi(id))
  }
  const descartar = (id) => {
    if (lista.some((n) => n.id === id && !n.leida)) fijarConteo(Math.max(0, conteo.current - 1))
    return aplicar((l) => l.filter((n) => n.id !== id), () => eliminarNotificacionApi(id))
  }
  const marcarTodas = () => {
    fijarConteo(0)
    return aplicar((l) => l.map((n) => ({ ...n, leida: true })), marcarTodasLeidasApi)
  }

  return { lista, noLeidas, marcarLeida, marcarTodas, descartar, refrescar: traer }
}

export default useNotificacionesApi
