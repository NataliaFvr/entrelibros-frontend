import { fmt } from '../utils/format'
import SummaryRow from './SummaryRow'
import OrderLines from './OrderLines'
import ReserveTimer from './ReserveTimer'
import ConfirmLink from './ConfirmLink'

const OrderSummary = ({ pedido, libros, error, onCancelar }) => {
  const total = pedido.sub + pedido.env
  return (
    <div className="card csum">
      <h3 className="fr">Tu pedido {pedido.n}</h3>
      <OrderLines pedido={pedido} libros={libros} />
      <SummaryRow titulo="Libros" valor={fmt(pedido.sub)} />
      <SummaryRow titulo="Envío" valor={fmt(pedido.env)} />
      <SummaryRow titulo="Total" valor={fmt(total)} total />
      <small className="ord-a">Enviado a: {pedido.addr}</small>
      <ReserveTimer reserva={pedido.reserva} />
      <p className="ferr" role="alert">{error}</p>
      <button className="btn main" type="submit" form="fPay">Pagar {fmt(total)}</button>
      <ConfirmLink texto="Cancelar compra" onConfirmar={onCancelar} />
    </div>
  )
}

export default OrderSummary
