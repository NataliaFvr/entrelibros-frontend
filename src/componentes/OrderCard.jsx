import { useNavigate } from 'react-router-dom'
import { useCompra } from '../hooks/useCompra'
import { fmt, mmss } from '../utils/format'
import { ETIQUETAS_PAGO, estadoPago } from '../utils/pedidos'
import useAhora from '../hooks/useAhora'
import SummaryRow from './SummaryRow'
import OrderLines from './OrderLines'
import ConfirmLink from './ConfirmLink'

const OrderCard = ({ pedido, libros }) => {
  const navigate = useNavigate()
  const { cancelarPedido } = useCompra()
  const ahora = useAhora()
  const estado = estadoPago(pedido, ahora)
  const [texto, clase] = ETIQUETAS_PAGO[estado]
  const pendiente = estado === 'PENDIENTE'

  return (
    <div className="card ord">
      <div className="ord-h">
        <b className="fr">Pedido {pedido.n}</b>
        <span className={`tg ${clase}`.trim()}>{estado === 'SIMULADO_APROBADO' ? pedido.est : texto}</span>
        <small>{pedido.date}</small>
      </div>
      <OrderLines pedido={pedido} libros={libros} />
      <SummaryRow titulo="Envío" valor={fmt(pedido.env)} />
      <SummaryRow titulo="Total" valor={fmt(pedido.total)} total />
      <small className="ord-a">Envío a: {pedido.addr}</small>
      {pendiente && (
        <div className="rvf-b">
          <small className="dim">Reserva: te quedan {mmss(pedido.venceEn - ahora)} min</small>
          <button className="btn main" type="button" onClick={() => navigate(`/pago/${pedido.n}`)}>Pagar ahora</button>
          <ConfirmLink texto="Cancelar compra" onConfirmar={() => cancelarPedido(pedido.n)} />
        </div>
      )}
    </div>
  )
}

export default OrderCard
