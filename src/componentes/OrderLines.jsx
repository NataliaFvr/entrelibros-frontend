import { fmt } from '../utils/format'
import SummaryRow from './SummaryRow'

// Los libros de un pedido, una fila por cada uno. Si el vendedor canceló su parte, el libro se ve tachado
// y el back ya lo descontó del total.
const OrderLines = ({ pedido, libros }) => {
  return pedido.its.map((i) => {
    const l = libros.find((x) => x.id === i.id)
    const titulo = l ? l.t : i.t || `Libro #${i.id}`
    if (i.cancelado) {
      return <SummaryRow key={i.id} titulo={<s>{titulo}</s>} detalle="Cancelado por el vendedor" valor={<s>{fmt(i.p * i.q)}</s>} />
    }
    return <SummaryRow key={i.id} titulo={titulo} detalle={`${l ? l.a : ''} · x${i.q}`} valor={fmt(i.p * i.q)} />
  })
}

export default OrderLines
