import { useNavigate } from 'react-router-dom'
import { useCompra } from '../hooks/useCompra'
import { useLibros } from '../hooks/useLibros'
import EmptyBlock from './EmptyBlock'
import OrderCard from './OrderCard'

// Pestaña Historial de Compras
const OrdersPanel = () => {
  const navigate = useNavigate()
  const { pedidos } = useCompra()
  const { libros } = useLibros()

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
