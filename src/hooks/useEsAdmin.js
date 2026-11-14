/* oxlint-disable no-unused-vars */
import { abrirGate,cerrarGate as cerrarGateAction,cancelarVerificacion,confirmarEmail,crearDireccion,eliminarDireccion as eliminarDireccionThunk,fetchUsuario,guardarPerfil,limpiarPendiente as limpiarPendienteAction,login as loginThunk,logout as logoutThunk,marcarPrincipal as marcarPrincipalThunk,NOTA_SIN_CONFIRMAR,quitarMarks as quitarMarksThunk,reenviarCodigo,registrar as registrarThunk,toggleMark as toggleMarkThunk } from '../redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'

// true si quien navega es administrador (en la tienda solo ve inicio, catálogo y fichas, en modo lectura)
const useEsAdmin = () => {
  const dispatch=useDispatch()
  const {user}=useSelector(s=>s.user)
  return user?.rol === 'ADMIN'
}

export default useEsAdmin
