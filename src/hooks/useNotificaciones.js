import { mostrarToast } from '../redux/toastSlice'
import { useEffect, useMemo } from 'react'
import { descartarNotificacion, fetchNotificaciones, marcarLeida, marcarTodasLeidas } from '../redux/notificacionesSlice'

// Se piden una vez por cuenta; después cada acción actualiza el estado con la respuesta del back
const useNotificaciones = (user, { dispatch, idUsuario, items, noLeidas, error }) => {
  const toast = (msg, accion) => dispatch(mostrarToast({ msg, accion }))
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
