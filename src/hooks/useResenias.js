/* oxlint-disable no-unused-vars */
import { abrirGate,cerrarGate as cerrarGateAction,cancelarVerificacion,confirmarEmail,crearDireccion,eliminarDireccion as eliminarDireccionThunk,fetchUsuario,guardarPerfil,limpiarPendiente as limpiarPendienteAction,login as loginThunk,logout as logoutThunk,marcarPrincipal as marcarPrincipalThunk,NOTA_SIN_CONFIRMAR,quitarMarks as quitarMarksThunk,reenviarCodigo,registrar as registrarThunk,toggleMark as toggleMarkThunk } from '../redux/authSlice'
import { useEffect, useMemo } from 'react'
import { useReduxDispatch, useReduxSelector } from '../redux/hooks'
import { eliminarResenaLibro, fetchEstadoResenaLibro, fetchResenasLibro, publicarResenaLibro } from '../redux/resenasSlice'

const SIN_PERMISO = { puedeResenar: false, motivo: '', idOrdenItem: null, miResenia: null }

// Reseñas de un libro y si la sesión actual puede opinar (lo decide el back)
const useResenias = (libroId) => {
  const dispatch = useReduxDispatch()
  const {user}=useReduxSelector(s=>s.auth)
  const guardadas = useReduxSelector((state) => state.resenas.libros[libroId])
  const estadoGuardado = useReduxSelector((state) => state.resenas.estadosLibro[libroId])

  useEffect(() => {
    if (guardadas === undefined) dispatch(fetchResenasLibro(libroId))
  }, [dispatch, libroId, guardadas])

  useEffect(() => {
    if (user && estadoGuardado === undefined) dispatch(fetchEstadoResenaLibro(libroId))
  }, [dispatch, libroId, user, estadoGuardado])

  const resenias = useMemo(() => guardadas || [], [guardadas])
  const estado = !user ? { ...SIN_PERMISO, motivo: 'Iniciá sesión para dejar una opinión.' } : estadoGuardado || SIN_PERMISO
  const miResenia = estado.miResenia
  const promedio = useMemo(
    () => (resenias.length ? resenias.reduce((a, r) => a + r.st, 0) / resenias.length : 0),
    [resenias],
  )

  const publicar = async (opinion) => {
    const resultado = await dispatch(publicarResenaLibro({ idOrdenItem: estado.idOrdenItem, miResenia, opinion }))
    if (resultado.error) throw new Error(resultado.error.message)
  }

  // Sin id borra la propia; el admin pasa el id de cualquier reseña
  const eliminar = async (id = miResenia?.id) => {
    const resena = resenias.find((r) => r.id === id) || miResenia
    if (!resena) return
    const resultado = await dispatch(eliminarResenaLibro(resena))
    if (resultado.error) throw new Error(resultado.error.message)
  }

  return { resenias, promedio, miResenia, puedeResenar: estado.puedeResenar, motivo: estado.motivo, publicar, eliminar }
}

export default useResenias
