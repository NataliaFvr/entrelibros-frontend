import { useNavigate } from 'react-router-dom'
import { rutaNotificacion } from '../utils/notificaciones'
import { tiempoRelativo } from '../utils/tiempo'
import { CloseIcon } from './Icons'

// Una notificación: al tocarla se marca como leída y, si tiene destino (según su tipo), te lleva ahí; la ✕ la descarta
const NotificationItem = ({ notificacion, onLeer, onDescartar, onCerrar }) => {
  const navigate = useNavigate()
  const { id, texto, fecha, leida } = notificacion
  const ruta = rutaNotificacion(notificacion)
  const abrir = () => {
    if (!leida) onLeer(id)
    if (ruta) { navigate(ruta); if (onCerrar) onCerrar() }
  }
  return (
    <li className={`notif-item${leida ? '' : ' nueva'}`}>
      <button className="notif-body" type="button" onClick={abrir}>
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
