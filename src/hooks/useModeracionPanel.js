import { useCallback, useEffect, useState } from 'react'
import { useLibros } from './useLibros'
import { useToast } from './useToast'
import { fuenteModeracion as fuente } from '../services/moderacionFuente'

const mensajeDe = (err) => (err && err.message) || 'No pudimos completar la acción. Intentá de nuevo.'

// Estado y acciones del panel de moderación: cola de solicitudes, pestaña activa y decisiones del admin.
// Tras aprobar o rechazar, la solicitud sale de la lista y se vuelve a pedir la cola al servidor.
const useModeracionPanel = () => {
  const toast = useToast()
  const { recargar } = useLibros()
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('NUEVO')
  const [procesando, setProcesando] = useState(null) // id de la solicitud en curso

  const traer = useCallback(async () => {
    try {
      setSolicitudes(await fuente.obtenerSolicitudes())
      setError('')
    } catch (err) {
      setError(mensajeDe(err))
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    let vivo = true
    fuente.obtenerSolicitudes()
      .then((lista) => { if (vivo) setSolicitudes(lista) })
      .catch((err) => { if (vivo) setError(mensajeDe(err)) })
      .finally(() => { if (vivo) setCargando(false) })
    return () => { vivo = false }
  }, [])

  // Devuelve { ok } o { error } (el modal de rechazo muestra el error sin cerrarse)
  const resolver = async (solicitud, accion) => {
    setProcesando(solicitud.id)
    try {
      await fuente.moderarSolicitud(solicitud.id, accion)
      setSolicitudes((lista) => lista.filter((s) => s.id !== solicitud.id))
      toast(accion.aprobado ? 'Libro aprobado: ya figura en el catálogo' : 'Libro rechazado: el vendedor verá tu motivo')
      recargar()
      traer()
      return { ok: true }
    } catch (err) {
      const mensaje = mensajeDe(err)
      if (accion.aprobado) setError(mensaje)
      return { error: mensaje }
    } finally {
      setProcesando(null)
    }
  }

  const aprobar = (solicitud) => resolver(solicitud, { aprobado: true })
  const rechazar = (solicitud, motivoRechazo) => resolver(solicitud, { aprobado: false, motivoRechazo })

  const visibles = solicitudes.filter((s) => s.tipoModeracion === tab)
  const cantidad = (tipo) => solicitudes.filter((s) => s.tipoModeracion === tipo).length

  return { visibles, cantidad, cargando, error, tab, setTab, procesando, aprobar, rechazar, recargarCola: traer }
}

export default useModeracionPanel
