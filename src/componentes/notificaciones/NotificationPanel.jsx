import NotificationItem from './NotificationItem'
import { CloseIcon } from '../comun/Icons'

// Contenido del desplegable de la campanita. Con `hayMas`, al final de la lista aparece "Ver más notificaciones".
const NotificationPanel = ({ id, lista, noLeidas, hayMas, cargandoMas, onVerMas, onLeer, onLeerTodas, onDescartar, onCerrar }) => {
  return (
    <section id={id} className="notif-panel" role="dialog" aria-label="Notificaciones">
      <div className="notif-head">
        <h3 className="fr">Notificaciones</h3>
        <button className="lnk" type="button" disabled={!noLeidas} onClick={onLeerTodas}>Marcar todas como leídas</button>
        <button className="notif-x" type="button" aria-label="Cerrar notificaciones" onClick={onCerrar}><CloseIcon /></button>
      </div>
      {lista.length ? (
        <ul className="notif-list">
          {lista.map((n) => <NotificationItem key={n.id} notificacion={n} onLeer={onLeer} onDescartar={onDescartar} onCerrar={onCerrar} />)}
          {hayMas && (
            <li className="notif-mas">
              <button className="lnk" type="button" disabled={cargandoMas} onClick={onVerMas}>
                {cargandoMas ? 'Cargando…' : 'Ver más notificaciones'}
              </button>
            </li>
          )}
        </ul>
      ) : (
        <p className="notif-empty">No tenés notificaciones.</p>
      )}
    </section>
  )
}

export default NotificationPanel