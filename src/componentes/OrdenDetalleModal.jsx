import { useLibros } from '../hooks/useLibros'
import { fechaCorta, fmt } from '../utils/format'
import AdminModal from './AdminModal'
import EtiquetaPago from './EtiquetaPago'
import SummaryRow from './SummaryRow'

const CANCELADAS = ['CANCELADO', 'VENCIDO']

// Detalle de una orden (solo lectura): estado, quién compra, adónde va, qué libros lleva y cuánto cuesta.
const OrdenDetalleModal = ({ orden: o, onCerrar }) => {
  const { libros } = useLibros()
  const canceladas = CANCELADAS.includes(o.estadoPago)

  return (
    <AdminModal titulo={`Orden #${o.n}`} onCerrar={onCerrar}>
      <p className="adm-tags">
        <EtiquetaPago estado={o.estadoPago} />
        <span className={`tg ${canceladas ? 'off' : 'used'}`}>Vendedores: {canceladas ? 'cancelada' : 'activa'}</span>
      </p>
      <div>
        <SummaryRow titulo="Comprador" valor={<b>{o.comprador}</b>} />
        <SummaryRow titulo="Fecha" valor={<b>{fechaCorta(o.fecha)}</b>} />
        <SummaryRow titulo="Destino" valor={<b>{o.destino || o.provincia}</b>} />
      </div>
      <div>
        <h3 className="fr adm-card-t">Libros</h3>
        {o.items.map((i) => {
          const l = libros.find((x) => x.id === i.id)
          return (
            <SummaryRow key={i.id} titulo={l ? l.t : `Libro #${i.id}`} valor={fmt(i.p * i.q)}
              detalle={`${l ? `${l.v} · ` : ''}x${i.q} · ${fmt(i.p)} c/u`} />
          )
        })}
        <SummaryRow titulo="Envío" valor={fmt(o.envio)} />
        <SummaryRow titulo="Total" valor={fmt(o.total)} total />
      </div>
      <div className="modal-btns">
        <button className="btn alt" type="button" onClick={onCerrar}>Cerrar</button>
      </div>
    </AdminModal>
  )
}

export default OrdenDetalleModal
