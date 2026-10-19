import { fmt } from '../utils/format'
import SummaryRow from './SummaryRow'
import ConfirmLink from './ConfirmLink'

const CLASE = { pendiente: 'pend', pagada: 'used', cancelada: 'off', vencida: 'off' }

// Una venta. Mientras el comprador no paga (pendiente) el vendedor la puede cancelar: el back saca sus libros de
// la orden y devuelve el stock. Una venta pagada no se cancela (el back lo rechaza), así que ahí no hay botón.
const SaleCard = ({ venta, onCancelar }) => {
  const total = venta.its.reduce((suma, i) => suma + i.p * i.q, 0)
  const hasta = venta.venceEn
    ? new Date(venta.venceEn).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })
    : ''
  return (
    <div className={`card ord${venta.cancelada ? ' ord-off' : ''}`}>
      <div className="ord-h">
        <b className="fr">Venta {venta.n}</b>
        <span>{new Date(`${venta.date}T00:00`).toLocaleDateString('es-AR')}</span>
        <span className={`tg ${CLASE[venta.estado]}`}>{venta.est}</span>
      </div>
      {venta.its.map((i) => <SummaryRow key={i.t} titulo={i.t} detalle={`x${i.q}`} valor={fmt(i.p * i.q)} />)}
      <SummaryRow titulo="Total" valor={fmt(total)} total />
      <small className="ord-a">Comprador: {venta.comprador}</small>
      {venta.destino && <small className="ord-a">Enviar a: {venta.destino}</small>}
      {venta.emailComprador && <small className="ord-a">Contacto del comprador: {venta.emailComprador}</small>}
      {venta.estado === 'pendiente' && (
        <div className="rvf-b">
          {hasta && <small className="dim">El comprador tiene los libros reservados hasta las {hasta}.</small>}
          <ConfirmLink texto="Cancelar venta" textoConfirmar="¿Seguro? Tocá de nuevo para cancelar la venta" onConfirmar={() => onCancelar(venta.id)} />
        </div>
      )}
    </div>
  )
}

export default SaleCard
