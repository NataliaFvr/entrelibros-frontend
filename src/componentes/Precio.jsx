import { fmt } from '../utils/format'

// Precio con el precio base tachado si hay descuento
const Precio = ({ libro }) => {
  return (
    <>
      {fmt(libro.p)}
      {libro.d > 0 && <s>{fmt(libro.base)}</s>}
    </>
  )
}

export default Precio
