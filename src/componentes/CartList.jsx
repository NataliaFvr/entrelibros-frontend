import { useCompra } from '../hooks/useCompra'
import CartRow from './CartRow'
import ShippingLines from './ShippingLines'

// `items` = [{ libro, q }]. Cada libro "descansa" sobre su propia repisa de madera.
const CartList = ({ items, libros }) => {
  const { cambiarCantidad, quitar } = useCompra()
  return (
    <div className="cart-list">
      <div className="estante">
        {items.map(({ libro, q }) => (
          <CartRow key={libro.id} libro={libro} q={q}
            onMas={() => cambiarCantidad(libro, 1)} onMenos={() => cambiarCantidad(libro, -1)} onQuitar={() => quitar(libro.id)} />
        ))}
      </div>
      <div className="card">
        <ShippingLines items={items.map(({ libro, q }) => ({ id: libro.id, q }))} libros={libros} />
      </div>
    </div>
  )
}

export default CartList
