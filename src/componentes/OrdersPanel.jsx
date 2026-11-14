import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useCompra } from '../hooks/useCompra'
import { useLibros } from '../hooks/useLibros'
import EmptyBlock from './EmptyBlock'
import OrderCard from './OrderCard'

// Pestaña Historial de Compras
const OrdersPanel = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const compraUser = useSelector((state) => state.user.user)
  const compraMarks = useSelector((state) => state.user.marks)
  const compraCarrito = useSelector((state) => state.carrito.items)
  const compraPedidos = useSelector((state) => state.pedidos.items)
  const { pedidos } = useCompra({ dispatch, user: compraUser, marks: compraMarks, carrito: compraCarrito, pedidos: compraPedidos })
  const librosRedux = useSelector((state) => state.libros.items)
  const loadingRedux = useSelector((state) => state.libros.loading)
  const errorRedux = useSelector((state) => state.libros.error)
  const categoriasRedux = useSelector((state) => state.libros.categorias.items)
  const { libros } = useLibros({ libros: librosRedux, loading: loadingRedux, error: errorRedux, listaCategorias: categoriasRedux })

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
