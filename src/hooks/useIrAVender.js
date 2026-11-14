/* oxlint-disable no-unused-vars */
import { abrirGate,cerrarGate as cerrarGateAction,cancelarVerificacion,confirmarEmail,crearDireccion,eliminarDireccion as eliminarDireccionThunk,fetchUsuario,guardarPerfil,limpiarPendiente as limpiarPendienteAction,login as loginThunk,logout as logoutThunk,marcarPrincipal as marcarPrincipalThunk,NOTA_SIN_CONFIRMAR,quitarMarks as quitarMarksThunk,reenviarCodigo,registrar as registrarThunk,toggleMark as toggleMarkThunk } from '../redux/userSlice'
import { useReduxDispatch, useReduxSelector } from '../redux/hooks'
import { useNavigate } from 'react-router-dom'

const RUTA_VENDER = '/vender'

// "Vender" lo usan el menú de escritorio, el menú móvil y el footer.
// Sin sesión abre el modal de login (y, al entrar, lleva a /vender); con sesión navega directo.
const useIrAVender = () => {
  const navigate = useNavigate()
  const dispatch=useReduxDispatch()
  const { user } = useReduxSelector((state) => state.user)

  const requiereLogin=(t,d=null,a=null)=>{if(user)return false;dispatch(abrirGate({tipo:t,destino:d,accion:a}));return true}
  return () => {
    if (!requiereLogin('sell', RUTA_VENDER)) navigate(RUTA_VENDER)
  }
}

export default useIrAVender
