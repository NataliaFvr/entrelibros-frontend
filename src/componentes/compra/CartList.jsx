import { useDispatch, useSelector } from 'react-redux'
import { selectCompra } from '../../redux/selectores'
import { useCompra } from '../../hooks/useCompra'
import CartRow from './CartRow'

// `items` = [{ libro, q }]. Cada libro "descansa" sobre su propia repisa de madera.
const CartList = ({ items }) => {
  const dispatch = useDispatch()
  const compra = useSelector(selectCompra)
  const { cambiarCantidad, quitar } = useCompra({ dispatch, ...compra })
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