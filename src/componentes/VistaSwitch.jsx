import { Link, useLocation } from 'react-router-dom'
import './VistaAdmin.css'

const VISTAS = [
  { to: '/', label: 'Vista tienda', gestion: false },
  { to: '/admin', label: 'Vista gestión', gestion: true },
]

// Selector entre la tienda y el panel de gestión. Lo usan el header de la tienda y el del panel (mismo lugar, mismo aspecto).
// En pantallas angostas muestra solo la vista a la que se puede ir (CSS).
const VistaSwitch = () => {
  const enGestion = useLocation().pathname.startsWith('/admin')
  return (
    <nav className="vista-sw" aria-label="Cambiar de vista">
      {VISTAS.map(({ to, label, gestion }) => {
        const activa = gestion === enGestion
        return <Link key={to} to={to} className={`vista-op${activa ? ' on' : ''}`} aria-current={activa ? 'page' : undefined}>{label}</Link>
      })}
    </nav>
  )
}

export default VistaSwitch
