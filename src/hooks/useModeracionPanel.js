import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSolicitudes, moderar } from '../redux/moderacionSlice'
import { useToast } from './useToast'

// Cola de moderación (redux/moderacionSlice.js), pestaña activa y decisiones del admin
const useModeracionPanel = () => {
  const dispatch = useDispatch()
  const toast = useToast()
  const { items: solicitudes, cargadas, loading, error } = useSelector((state) => state.moderacion)
  const [tab, setTab] = useState('NUEVO')
  const [procesando, setProcesando] = useState(null)
  const [errorAccion, setErrorAccion] = useState('')

  useEffect(() => {
    if (!cargadas) dispatch(fetchSolicitudes())
  }, [dispatch, cargadas])

  // Devuelve { ok } o { error } (el modal de rechazo muestra el error sin cerrarse)
  const resolver = async (solicitud, accion) => {
    setProcesando(solicitud.id)
    setErrorAccion('')
    const resultado = await dispatch(moderar({ id: solicitud.id, accion }))
    setProcesando(null)
    if (resultado.error) {
      if (accion.aprobado) setErrorAccion(resultado.error.message)
      return { error: resultado.error.message }
    }
    toast(accion.aprobado ? 'Libro aprobado: ya figura en el catálogo' : 'Libro rechazado: el vendedor verá tu motivo')
    return { ok: true }
  }

  const aprobar = (solicitud) => resolver(solicitud, { aprobado: true })
  const rechazar = (solicitud, motivoRechazo) => resolver(solicitud, { aprobado: false, motivoRechazo })

  const visibles = solicitudes.filter((s) => s.tipoModeracion === tab)
  const cantidad = (tipo) => solicitudes.filter((s) => s.tipoModeracion === tipo).length

  return {
    visibles, cantidad, cargando: loading || (!cargadas && !error), error: errorAccion || error || '', tab, setTab, procesando,
    aprobar, rechazar, recargarCola: () => dispatch(fetchSolicitudes()),
  }
}

export default useModeracionPanel
