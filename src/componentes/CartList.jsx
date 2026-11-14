import { useDispatch, useSelector } from 'react-redux'
import { useCompra } from '../hooks/useCompra'
import CartRow from './CartRow'

// `items` = [{ libro, q }]. Cada libro "descansa" sobre su propia repisa de madera.
const CartList = ({ items }) => {
  const dispatch = useDispatch()
  const compraUser = useSelector((state) => state.user.user)
  const compraMarks = useSelector((state) => state.user.marks)
  const compraCarrito = useSelector((state) => state.carrito.items)
  const compraPedidos = useSelector((state) => state.pedidos.items)
  const { cambiarCantidad, quitar } = useCompra({ dispatch, user: compraUser, marks: compraMarks, carrito: compraCarrito, pedidos: compraPedidos })
  return (
    <div className="cart-list">
      <div className="estante">
        {items.map(({ libro, q }) => (
          <CartRow key={libro.id} libro={libro} q={q} max={libro.maxCantidad}
            onMas={() => cambiarCantidad(libro, 1)} onMenos={() => cambiarCantidad(libro, -1)} onQuitar={() => quitar(libro.id)} />
        ))}
      </div>
    </div>
  )
}

export default CartList
