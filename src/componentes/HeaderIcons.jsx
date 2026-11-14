/* oxlint-disable no-unused-vars */
import {urlFotoUsuario} from '../api/usuariosApi'
import { abrirGate,cerrarGate as cerrarGateAction,cancelarVerificacion,confirmarEmail,crearDireccion,eliminarDireccion as eliminarDireccionThunk,fetchUsuario,guardarPerfil,limpiarPendiente as limpiarPendienteAction,login as loginThunk,logout as logoutThunk,marcarPrincipal as marcarPrincipalThunk,NOTA_SIN_CONFIRMAR,quitarMarks as quitarMarksThunk,reenviarCodigo,registrar as registrarThunk,toggleMark as toggleMarkThunk } from '../redux/authSlice'
import {useDispatch,useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useCompra } from '../hooks/useCompra'
import { BookmarkIcon, ShelfIcon, UserIcon } from './Icons'
import Avatar from './Avatar'
import NotificationBell from './NotificationBell'

// Con Enter o espacio también se activan (son div con role="button")
const alTeclear = (accion) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); accion() }
}

const HeaderIcons = () => {
  const navigate = useNavigate()
  const dispatch=useDispatch()
  const {user}=useSelector(s=>s.auth)

  const perfil=user?{avatar:user.avatar||'',foto:user.tieneFoto?urlFotoUsuario(user.id):''}:{}
  const requiereLogin=(t,d=null,a=null)=>{if(user)return false;dispatch(abrirGate({tipo:t,destino:d,accion:a}));return true}
  const { cartCount } = useCompra()

  const irACuenta = () => navigate(user ? '/cuenta' : '/ingresar')
  const abrirEstanteria = () => {
    if (requiereLogin('cart')) return
    navigate('/carrito')
  }
  const abrirMarcapaginas = () => {
    if (requiereLogin('fav', '/cuenta/marcapaginas')) return
    navigate('/cuenta/marcapaginas')
  }

  return (
    <div className="header-icons">
      <div className="icon-btn" role="button" tabIndex={0} aria-label="Mi cuenta" onClick={irACuenta} onKeyDown={alTeclear(irACuenta)}>
        {user ? <Avatar user={user} perfil={perfil} size={30} /> : <UserIcon />}
      </div>
      <NotificationBell />
      <div className="icon-btn" role="button" tabIndex={0} aria-label="Mi Marcapáginas" title="Mi Marcapáginas" onClick={abrirMarcapaginas} onKeyDown={alTeclear(abrirMarcapaginas)}>
        <BookmarkIcon />
      </div>
      <div className="icon-btn" role="button" tabIndex={0} aria-label="Mi estantería" title="Mi estantería" onClick={abrirEstanteria} onKeyDown={alTeclear(abrirEstanteria)}>
        <ShelfIcon />
        <span className="cart-badge" hidden={cartCount === 0}>{cartCount > 99 ? '99+' : cartCount}</span>
      </div>
    </div>
  )
}

export default HeaderIcons
