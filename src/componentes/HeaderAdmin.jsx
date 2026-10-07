import { useAuth } from '../hooks/useAuth'
import VistaSwitch from './VistaSwitch'
import './VistaAdmin.css'

// Lado derecho del header de la tienda cuando quien mira es administrador:
// sin perfil, estantería ni notificaciones; solo el cambio de vista y la sesión.
const HeaderAdmin = () => {
  const { user, logout } = useAuth()
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
