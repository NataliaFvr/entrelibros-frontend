import { useDispatch, useSelector } from 'react-redux'
import { selectCompra, selectCatalogo } from '../../redux/selectores'
import { useNavigate } from 'react-router-dom'
import { useCompra } from '../../hooks/useCompra'
import { useLibros } from '../../hooks/useLibros'
import EmptyBlock from '../comun/EmptyBlock'
import OrderCard from './OrderCard'

// Pestaña Historial de Compras
const OrdersPanel = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const compra = useSelector(selectCompra)
  const { pedidos } = useCompra({ dispatch, ...compra })
  const catalogo = useSelector(selectCatalogo)
  const { libros } = useLibros(catalogo)

  if (!pedidos.length) {
    return <EmptyBlock titulo="Todavía no compraste nada" texto="Tus pedidos van a aparecer acá." boton="Ver libros" onClick={() => navigate('/libros')} />
  }
  return (
    <div>
      {pedidos.map((p) => <OrderCard key={p.n} pedido={p} libros={libros} />)}
    </div>
  )
}

export default OrdersPanel