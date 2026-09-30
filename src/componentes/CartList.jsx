import { useCompra } from '../hooks/useCompra'
import CartRow from './CartRow'
import ShippingLines from './ShippingLines'

// `items` = [{ libro, q }]
const CartList = ({ items, libros }) => {
  const { cambiarCantidad, quitar } = useCompra()
  return (
    <div className="card">
      {items.map(({ libro, q }) => (
        <CartRow key={libro.id} libro={libro} q={q}
          onMas={() => cambiarCantidad(libro, 1)} onMenos={() => cambiarCantidad(libro, -1)} onQuitar={() => quitar(libro.id)} />
      ))}
      <ShippingLines items={items.map(({ libro, q }) => ({ id: libro.id, q }))} libros={libros} />
    </div>
  )
}

export default CartList
