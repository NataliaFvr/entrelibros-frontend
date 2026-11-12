import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { descartarNotificacion, fetchNotificaciones, marcarLeida, marcarTodasLeidas } from '../redux/notificacionesSlice'
import { useToast } from './useToast'

// Se piden una vez por cuenta; después cada acción actualiza el estado con la respuesta del back
const useNotificaciones = (user) => {
  const dispatch = useDispatch()
  const toast = useToast()
  const { idUsuario, items, noLeidas, error } = useSelector((state) => state.notificaciones)
  const cargadas = idUsuario === user.id

  useEffect(() => {
    if (!cargadas && !error) dispatch(fetchNotificaciones(user.id))
  }, [dispatch, cargadas, error, user.id])

  const lista = useMemo(() => (cargadas ? items : []), [cargadas, items])

  const ejecutar = async (accion) => {
    const resultado = await dispatch(accion)
    if (resultado.error) toast(resultado.error.message)
  }

  return {
    lista,
    noLeidas: cargadas ? noLeidas : 0,
    marcarLeida: (id) => ejecutar(marcarLeida(id)),
    marcarTodas: () => ejecutar(marcarTodasLeidas()),
    descartar: (id) => ejecutar(descartarNotificacion(id)),
  }
}

export default useNotificaciones
