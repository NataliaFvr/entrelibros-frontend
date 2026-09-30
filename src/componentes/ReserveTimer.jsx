import useAhora from '../hooks/useAhora'
import { mmss } from '../utils/format'

// Cuenta regresiva de la reserva; se pone en rojo con menos de 5 minutos
const ReserveTimer = ({ reserva }) => {
  const restante = reserva - useAhora()
  return (
    <div className={`rsv${restante < 300000 ? ' low' : ''}`}>
      <span aria-hidden="true">⏳</span>
      <span>Reservamos tus libros por <b>{mmss(restante)}</b></span>
    </div>
  )
}

export default ReserveTimer
