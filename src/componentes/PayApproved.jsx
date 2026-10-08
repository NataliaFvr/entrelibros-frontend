import { fmt } from '../utils/format'
import SummaryRow from './SummaryRow'
import OrderLines from './OrderLines'
import { nombreMetodo } from '../data/metodosPago'

const PayApproved = ({ pedido, libros, onVerCompras, onSeguir }) => {
  return (
    <div className="card pay-res">
      <div className="pay-ic" aria-hidden="true">✓</div>
      <h2 className="fr">¡Pago aprobado!</h2>
      <p>
        Pedido <b>{pedido.n}</b>{pedido.proveedor ? ` · pagado con ${nombreMetodo(pedido.proveedor)}` : ''}.
        {' '}Los vendedores ya fueron avisados y van a preparar tu envío.
      </p>
      <div className="sum">
        <OrderLines pedido={pedido} libros={libros} />
        <SummaryRow titulo="Envío" valor={fmt(pedido.env)} />
        <SummaryRow titulo="Total pagado" valor={fmt(pedido.sub + pedido.env)} total />
        <small className="ord-a">Envío a: {pedido.addr}</small>
      </div>
      <div className="rvf-b" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn main" type="button" onClick={onVerCompras}>Ver mis compras</button>
        <button className="btn alt" type="button" onClick={onSeguir}>Seguir explorando</button>
      </div>
      <small className="dim">Pago simulado: no se realizó ningún cobro real.</small>
    </div>
  )
}

export default PayApproved
