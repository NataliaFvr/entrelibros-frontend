import { fmt } from '../utils/format'
import SummaryRow from './SummaryRow'

// Los libros de un pedido, una fila por cada uno
const OrderLines = ({ pedido, libros }) => {
  return pedido.its.map((i) => {
    const l = libros.find((x) => x.id === i.id)
    return <SummaryRow key={i.id} titulo={l ? l.t : `Libro #${i.id}`} detalle={`${l ? l.a : ''} · x${i.q}`} valor={fmt(i.p * i.q)} />
  })
}

export default OrderLines
