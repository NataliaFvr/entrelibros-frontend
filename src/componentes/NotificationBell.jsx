import './NotificationBell.css'
import { useAuth } from '../hooks/useAuth'
import useNotificaciones from '../hooks/useNotificaciones'
import usePopover from '../hooks/usePopover'
import { BellIcon } from './Icons'
import NotificationPanel from './NotificationPanel'

const ID_PANEL = 'panel-notificaciones'

const Campana = ({ user }) => {
  const { lista, noLeidas, marcarLeida, marcarTodas, descartar } = useNotificaciones(user)
  const popover = usePopover()
  const etiqueta = noLeidas ? `Notificaciones (${noLeidas} sin leer)` : 'Notificaciones'

  return (
    <div className="notif" onKeyDown={popover.alTeclear}>
      <button className={`icon-btn notif-btn${popover.abierto ? ' on' : ''}`} type="button" aria-label={etiqueta} title="Notificaciones"
        aria-haspopup="dialog" aria-expanded={popover.abierto} aria-controls={ID_PANEL} onClick={popover.alternar}>
        <BellIcon />
        <span className="cart-badge" hidden={noLeidas === 0}>{noLeidas > 99 ? '99+' : noLeidas}</span>
      </button>
      {popover.abierto && (
        <>
          <div className="notif-back" onClick={popover.cerrar} />
          <NotificationPanel id={ID_PANEL} lista={lista} noLeidas={noLeidas} onLeer={marcarLeida} onLeerTodas={marcarTodas}
            onDescartar={descartar} onCerrar={popover.cerrar} />
        </>
      )}
    </div>
  )
}

// Campanita del header (comprador y vendedor). Sin sesión no se muestra.
const NotificationBell = () => {
  const { user } = useAuth()
  if (!user) return null
  return <Campana key={user.nombreUsuario} user={user} />
}

export default NotificationBell
