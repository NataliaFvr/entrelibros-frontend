import { fmt } from '../utils/format'
import SummaryRow from './SummaryRow'

// No hay seguimiento de envíos: una venta está paga o, si el vendedor la canceló, cancelada.
// Una venta pagada no se puede cancelar (el back lo rechaza), así que no hay botón.
const SaleCard = ({ venta }) => {
  const total = venta.its.reduce((suma, i) => suma + i.p * i.q, 0)
  return (
    <div className={`card ord${venta.cancelada ? ' ord-off' : ''}`}>
      <div className="ord-h">
        <b className="fr">Venta {venta.n}</b>
        <span>{new Date(`${venta.date}T00:00`).toLocaleDateString('es-AR')}</span>
        {venta.cancelada ? <span className="tg off">Cancelada</span> : <span className="tg used">Pagada</span>}
      </div>
      {venta.its.map((i) => <SummaryRow key={i.t} titulo={i.t} detalle={`x${i.q}`} valor={fmt(i.p * i.q)} />)}
      <SummaryRow titulo="Total" valor={fmt(total)} total />
      <small className="ord-a">Comprador: {venta.comprador}</small>
      {venta.destino && <small className="ord-a">Enviar a: {venta.destino}</small>}
    </div>
  )
}

export default SaleCard
