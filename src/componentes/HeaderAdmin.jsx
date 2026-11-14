/* oxlint-disable no-unused-vars */
import { abrirGate,cerrarGate as cerrarGateAction,cancelarVerificacion,confirmarEmail,crearDireccion,eliminarDireccion as eliminarDireccionThunk,fetchUsuario,guardarPerfil,limpiarPendiente as limpiarPendienteAction,login as loginThunk,logout as logoutThunk,marcarPrincipal as marcarPrincipalThunk,NOTA_SIN_CONFIRMAR,quitarMarks as quitarMarksThunk,reenviarCodigo,registrar as registrarThunk,toggleMark as toggleMarkThunk } from '../redux/authSlice'
import {useDispatch,useSelector} from 'react-redux'
import VistaSwitch from './VistaSwitch'
import './VistaAdmin.css'

// Lado derecho del header de la tienda cuando quien mira es administrador:
// sin perfil, estantería ni notificaciones; solo el cambio de vista y la sesión.
const HeaderAdmin = () => {
  const dispatch=useDispatch()
  const {user}=useSelector(s=>s.auth)
  const logout=()=>dispatch(logoutThunk())
  return (
    <div className="header-icons header-admin">
      <VistaSwitch />
      <span className="tg">ADMIN</span>
      <span className="adm-user">{user.nombreUsuario}</span>
      <button className="lnk" type="button" onClick={logout}>Cerrar sesión</button>
    </div>
  )
}

export default HeaderAdmin
