import { tiempoRelativo } from '../utils/tiempo'
import { CloseIcon } from './Icons'

// Una notificación: al tocarla se marca como leída; la ✕ la descarta
const NotificationItem = ({ notificacion, onLeer, onDescartar }) => {
  const { id, texto, fecha, leida } = notificacion
  return (
    <li className={`notif-item${leida ? '' : ' nueva'}`}>
      <button className="notif-body" type="button" onClick={() => !leida && onLeer(id)}>
        <span className="notif-dot" aria-hidden="true" />
        <span className="notif-txt">
          <span className="notif-msg">{texto}</span>
          <small>{tiempoRelativo(fecha)}{leida ? '' : ' · Sin leer'}</small>
        </span>
      </button>
      <button className="notif-del" type="button" aria-label="Descartar notificación" onClick={() => onDescartar(id)}>
        <CloseIcon />
      </button>
    </li>
  )
}

export default NotificationItem
