import useLibroPropio from '../hooks/useLibroPropio'
import ProductCard from './ProductCard'
import EmptyState from './EmptyState'

const ProductGrid = ({ libros, topIds, ordenPorVentas, onLimpiar }) => {
  const { esPropio } = useLibroPropio()
  return (
    <div className="grid">
      {libros.length
        ? libros.map((l) => <ProductCard key={l.id} libro={l} masVendido={ordenPorVentas && topIds.has(l.id)} propio={esPropio(l)} />)
        : <EmptyState onLimpiar={onLimpiar} />}
    </div>
  )
}

export default ProductGrid
