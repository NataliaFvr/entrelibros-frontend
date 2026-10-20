import { Link } from 'react-router-dom'
import { fmt } from '../utils/format'
import SummaryRow from './SummaryRow'

// Los libros de un pedido, una fila por cada uno. Si el vendedor canceló su parte, el libro se ve tachado
// y el back ya lo descontó del total. Con `conOpinion` (compra pagada) cada libro lleva el link para opinar:
// la opinión se deja en la ficha del libro, y el link abre ahí el formulario.
const OrderLines = ({ pedido, libros, conOpinion = false }) => {
  return pedido.its.map((i) => {
    const l = libros.find((x) => x.id === i.id)
    const titulo = l ? l.t : i.t || `Libro #${i.id}`
    if (i.cancelado) {
      return <SummaryRow key={i.id} titulo={<s>{titulo}</s>} detalle="Cancelado por el vendedor" valor={<s>{fmt(i.p * i.q)}</s>} />
    }
    return (
      <div key={i.id}>
        <SummaryRow titulo={titulo} detalle={l ? `${l.a} · x${i.q}` : `x${i.q}`} valor={fmt(i.p * i.q)} />
        {conOpinion && <Link className="lnk opinar-lnk" to={`/libro/${i.id}?opinar=1`}>Opinar sobre este libro</Link>}
      </div>
    )
  })
}

export default OrderLines
