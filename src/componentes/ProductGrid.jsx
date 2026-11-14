import { useSelector } from 'react-redux'
import useLibroPropio from '../hooks/useLibroPropio'
import ProductCard from './ProductCard'
import EmptyState from './EmptyState'

const ProductGrid = ({ libros, topIds, ordenPorVentas, onLimpiar, error = false, onReintentar }) => {
  const user = useSelector((state) => state.user.user)
  const { esPropio } = useLibroPropio(user)
  return (
    <div className="grid">
      {libros.length
        ? libros.map((l) => <ProductCard key={l.id} libro={l} masVendido={ordenPorVentas && topIds.has(l.id)} propio={esPropio(l)} />)
        : <EmptyState onLimpiar={onLimpiar} error={error} onReintentar={onReintentar} />}
    </div>
  )
}

export default ProductGrid
