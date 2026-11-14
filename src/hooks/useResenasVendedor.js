/* oxlint-disable no-unused-vars */
import { mostrarToast } from '../redux/toastSlice'
import { abrirGate,cerrarGate as cerrarGateAction,cancelarVerificacion,confirmarEmail,crearDireccion,eliminarDireccion as eliminarDireccionThunk,fetchUsuario,guardarPerfil,limpiarPendiente as limpiarPendienteAction,login as loginThunk,logout as logoutThunk,marcarPrincipal as marcarPrincipalThunk,NOTA_SIN_CONFIRMAR,quitarMarks as quitarMarksThunk,reenviarCodigo,registrar as registrarThunk,toggleMark as toggleMarkThunk } from '../redux/userSlice'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { eliminarResenaVendedor, fetchEstadoResenaVendedor, fetchResenasVendedor, publicarResenaVendedor } from '../redux/resenasSlice'
import { useLibros } from './useLibros'

const SIN_PERMISO = { puedeResenar: false, motivo: '', idPago: null, miResena: null }

const useResenasVendedor = (tienda, idConocido = null) => {
  const dispatch = useDispatch()
  const {user}=useSelector(s=>s.user)
  const { libros } = useLibros()
  const toast = (msg, accion) => dispatch(mostrarToast({ msg, accion }))
  const idVendedor = idConocido ?? libros.find((libro) => libro.v === tienda)?.vId ?? null
  const guardadas = useSelector((state) => (idVendedor == null ? undefined : state.resenas.vendedores[idVendedor]))
  const estadoGuardado = useSelector((state) => (idVendedor == null ? undefined : state.resenas.estadosVendedor[idVendedor]))

  useEffect(() => {
    if (idVendedor != null && guardadas === undefined) dispatch(fetchResenasVendedor(idVendedor))
  }, [dispatch, idVendedor, guardadas])

  useEffect(() => {
    if (idVendedor != null && user && estadoGuardado === undefined) dispatch(fetchEstadoResenaVendedor(idVendedor))
  }, [dispatch, idVendedor, user, estadoGuardado])

  const resenias = useMemo(() => guardadas || [], [guardadas])
  const promedio = useMemo(
    () => (resenias.length ? resenias.reduce((suma, resenia) => suma + resenia.st, 0) / resenias.length : 0),
    [resenias],
  )
  const estado = !user ? { ...SIN_PERMISO, motivo: 'Iniciá sesión para dejar una reseña.' } : estadoGuardado || SIN_PERMISO
  const miResena = estado.miResena

  const publicar = async (clasificacion, comentario) => {
    const resultado = await dispatch(publicarResenaVendedor({ idVendedor, idPago: estado.idPago, miResena, clasificacion, comentario }))
    if (resultado.error) { toast(resultado.error.message); return false }
    toast(miResena ? 'Reseña actualizada' : '¡Gracias por calificar al vendedor!')
    return true
  }

  const eliminar = async (idResena = miResena?.id) => {
    const resena = resenias.find((r) => r.id === idResena) || miResena
    if (!resena) return false
    const resultado = await dispatch(eliminarResenaVendedor({ ...resena, idVendedor }))
    if (resultado.error) { toast(resultado.error.message); return false }
    toast('Reseña eliminada')
    return true
  }

  return {
    resenias,
    promedio,
    miResena,
    esPropio: Boolean(user) && idVendedor != null && user.id === idVendedor,
    esAdmin: user?.rol === 'ADMIN',
    puedeResenar: estado.puedeResenar,
    motivo: estado.motivo,
    publicar,
    eliminar,
  }
}

export default useResenasVendedor
