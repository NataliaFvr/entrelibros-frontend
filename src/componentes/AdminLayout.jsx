import { Link, Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { SECCIONES_ADMIN } from '../data/admin'
import ScrollToTop from './ScrollToTop'
import Footer from './Footer'
import VistaSwitch from './VistaSwitch'
import './AdminPanel.css'

// Marco del panel de administración: barra propia con las secciones y el mismo pie que la tienda (en modo administrador).
// Solo entra el rol ADMIN; sin sesión manda a ingresar y vuelve a la misma pantalla.
const AdminLayout = () => {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  if (!user) return <Navigate to="/ingresar" replace state={{ from: pathname }} />
  if (user.rol !== 'ADMIN') return <Navigate to="/" replace />

  const salir = () => {
    navigate('/')
    logout()
  }

  return (
    <div className="adm-shell">
      <ScrollToTop />
      <header>
        <div className="adm-navbar">
          <Link to="/admin" className="logo-block">
            <span className="logo-mark" role="img" aria-label="Logo Entrelibros" />
            Entrelibros
          </Link>
          <div className="adm-bar">
            <nav className="adm-nav" aria-label="Secciones de administración">
              {SECCIONES_ADMIN.map(({ to, label, end }) => (
                <NavLink key={to} to={to} end={end} className={({ isActive }) => `adm-ni${isActive ? ' on' : ''}`}>{label}</NavLink>
              ))}
            </nav>
            <div className="adm-who">
              <VistaSwitch />
              <span className="tg">ADMIN</span>
              <span className="adm-user">{user.nombreUsuario}</span>
              <button className="lnk" type="button" onClick={salir}>Cerrar sesión</button>
            </div>
          </div>
        </div>
      </header>
      <Outlet />
      <Footer />
    </div>
  )
}

export default AdminLayout
