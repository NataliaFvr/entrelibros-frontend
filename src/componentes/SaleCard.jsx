import { fmt } from '../utils/format'
import ConfirmLink from './ConfirmLink'
import SummaryRow from './SummaryRow'

// No hay seguimiento de envíos: una venta está paga o, si el vendedor la canceló, cancelada.
const SaleCard = ({ venta, ocupado = false, onCancelar }) => {
  const total = venta.its.reduce((suma, i) => suma + i.p * i.q, 0)
  return (
    <div className={`card ord${venta.cancelada ? ' ord-off' : ''}`} aria-busy={ocupado}>
      <div className="ord-h">
        <b className="fr">Venta {venta.n}</b>
        <span>{new Date(`${venta.date}T00:00`).toLocaleDateString('es-AR')}</span>
        {venta.cancelada ? <span className="tg off">Cancelada</span> : <span className="tg used">Pagada</span>}
      </div>
      {venta.its.map((i) => <SummaryRow key={i.t} titulo={i.t} detalle={`x${i.q}`} valor={fmt(i.p * i.q)} />)}
      <SummaryRow titulo="Total" valor={fmt(total)} total />
      <small className="ord-a">Comprador: {venta.comprador}</small>
      {venta.destino && <small className="ord-a">Enviar a: {venta.destino}</small>}
      {!venta.cancelada && (
        <div className="sale-acts">
          {ocupado
            ? <small className="dim">Procesando…</small>
            : <ConfirmLink texto="Cancelar venta" onConfirmar={onCancelar} />}
        </div>
      )}
    </div>
  )
}

export default SaleCard
