import { fmt } from '../utils/format'
import SummaryRow from './SummaryRow'

const SaleCard = ({ venta }) => {
  const total = venta.its.reduce((suma, i) => suma + i.p * i.q, 0)
  return (
    <div className="card ord">
      <div className="ord-h">
        <b className="fr">Venta {venta.n}</b>
        <span>{new Date(`${venta.date}T00:00`).toLocaleDateString('es-AR')}</span>
        <span className="tg used">{venta.est}</span>
      </div>
      {venta.its.map((i) => <SummaryRow key={i.t} titulo={i.t} detalle={`x${i.q}`} valor={fmt(i.p * i.q)} />)}
      <SummaryRow titulo="Total" valor={fmt(total)} total />
      <small className="ord-a">Comprador: {venta.comprador}</small>
    </div>
  )
}

export default SaleCard
