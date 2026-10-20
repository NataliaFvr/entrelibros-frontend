import { useNavigate } from 'react-router-dom'
import { useCompra } from '../hooks/useCompra'
import { fechaCorta, fmt, mmss } from '../utils/format'
import { nombreMetodo } from '../data/metodosPago'
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
  const pagada = estado === 'SIMULADO_APROBADO'
  // Con la compra pagada, una fila por vendedor: su contacto (lo manda el back para coordinar la entrega) y el botón
  // para calificarlo. No aparecen los vendedores que cancelaron su parte.
  const vendedores = [...new Map(pedido.its
    .filter((i) => i.idVendedor != null && !i.cancelado)
    .map((i) => [i.idVendedor, {
      nombre: libros.find((l) => l.vId === i.idVendedor)?.v || i.tiendaV,
      contacto: [i.emailV, i.telV].filter(Boolean).join(' · '),
    }]))]

  return (
    <div className="card ord">
      <div className="ord-h">
        <b className="fr">Pedido {pedido.n}</b>
        <span className={`tg ${clase}`.trim()}>{estado === 'SIMULADO_APROBADO' ? pedido.est : texto}</span>
        <small>{fechaCorta(pedido.date)}</small>
      </div>
      <OrderLines pedido={pedido} libros={libros} conOpinion={pagada} />
      <SummaryRow titulo="Envío" valor={fmt(pedido.env)} />
      <SummaryRow titulo="Total" valor={fmt(pedido.total)} total />
      <small className="ord-a">
        Envío a: {pedido.addr}{pedido.proveedor && ` · Pagado con ${nombreMetodo(pedido.proveedor)}`}
      </small>

      {pendiente && (
        <div className="rvf-b">
          <small className="dim">Reserva: te quedan {mmss(pedido.venceEn - ahora)} min</small>
          <button className="btn main" type="button" onClick={() => navigate(`/pago/${pedido.n}`)}>Pagar ahora</button>
          <ConfirmLink texto="Cancelar compra" onConfirmar={() => cancelarPedido(pedido.n)} />
        </div>
      )}
      {pagada && vendedores.length > 0 && (
        <div className="ord-vend">
          <h4>{vendedores.length > 1 ? 'Vendedores' : 'Vendedor'}</h4>
          {vendedores.map(([idVendedor, v]) => (
            <div key={idVendedor} className="ord-v">
              <b>{v.nombre || 'Vendedor'}</b>
              <small>{v.contacto}</small>
              <button className="btn alt" type="button" onClick={() => navigate(`/vendedor/${idVendedor}?tab=resenias`)}>Calificar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderCard
