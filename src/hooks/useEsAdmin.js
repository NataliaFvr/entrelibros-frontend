/* oxlint-disable no-unused-vars */
import { abrirGate,cerrarGate as cerrarGateAction,cancelarVerificacion,confirmarEmail,crearDireccion,eliminarDireccion as eliminarDireccionThunk,fetchUsuario,guardarPerfil,limpiarPendiente as limpiarPendienteAction,login as loginThunk,logout as logoutThunk,marcarPrincipal as marcarPrincipalThunk,NOTA_SIN_CONFIRMAR,quitarMarks as quitarMarksThunk,reenviarCodigo,registrar as registrarThunk,toggleMark as toggleMarkThunk } from '../redux/userSlice'
import { useReduxDispatch, useReduxSelector } from '../redux/hooks'

// true si quien navega es administrador (en la tienda solo ve inicio, catálogo y fichas, en modo lectura)
const useEsAdmin = () => {
  const dispatch=useReduxDispatch()
  const {user}=useReduxSelector(s=>s.user)
  return user?.rol === 'ADMIN'
}

export default useEsAdmin
