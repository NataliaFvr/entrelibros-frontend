import { fmt } from '../utils/format'
import ConfirmLink from './ConfirmLink'
import SummaryRow from './SummaryRow'

// Estado de la venta: cancelada, enviada o paga a la espera de que el vendedor registre el envío
const estadoVenta = (venta) => {
  if (venta.cancelada) return ['Cancelada', 'off']
  if (venta.enviada) return ['Enviada', 'used']
  return ['Pendiente de envío', '']
}

const SaleCard = ({ venta, ocupado = false, onEnviar, onCancelar }) => {
  const total = venta.its.reduce((suma, i) => suma + i.p * i.q, 0)
  const [texto, clase] = estadoVenta(venta)
  return (
    <div className={`card ord${venta.cancelada ? ' ord-off' : ''}`} aria-busy={ocupado}>
      <div className="ord-h">
        <b className="fr">Venta {venta.n}</b>
        <span>{new Date(`${venta.date}T00:00`).toLocaleDateString('es-AR')}</span>
        {!venta.cancelada && <span className="tg used">Pagada</span>}
        <span className={`tg ${clase}`.trim()}>{texto}</span>
      </div>
      {venta.its.map((i) => <SummaryRow key={i.t} titulo={i.t} detalle={`x${i.q}`} valor={fmt(i.p * i.q)} />)}
      <SummaryRow titulo="Total" valor={fmt(total)} total />
      <small className="ord-a">Comprador: {venta.comprador}</small>
      {venta.destino && <small className="ord-a">Enviar a: {venta.destino}</small>}
      {!venta.cancelada && (
        <div className="sale-acts">
          {venta.enviada
            ? <small className="dim">Envío registrado. Ya no se puede cancelar esta venta.</small>
            : (
              <>
                <button className="btn main" type="button" disabled={ocupado} onClick={onEnviar}>{ocupado ? 'Procesando…' : 'Registrar envío'}</button>
                {!ocupado && <ConfirmLink texto="Cancelar venta" onConfirmar={onCancelar} />}
              </>
            )}
        </div>
      )}
    </div>
  )
}

export default SaleCard
