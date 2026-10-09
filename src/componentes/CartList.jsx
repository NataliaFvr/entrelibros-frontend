import { useCompra } from '../hooks/useCompra'
import CartRow from './CartRow'

// `items` = [{ libro, q }]. Cada libro "descansa" sobre su propia repisa de madera.
const CartList = ({ items }) => {
  const { cambiarCantidad, quitar } = useCompra()
  return (
    <div className="cart-list">
      <div className="estante">
        {items.map(({ libro, q }) => (
          <CartRow key={libro.id} libro={libro} q={q}
            onMas={() => cambiarCantidad(libro, 1)} onMenos={() => cambiarCantidad(libro, -1)} onQuitar={() => quitar(libro.id)} />
        ))}
      </div>
    </div>
  )
}

export default CartList
