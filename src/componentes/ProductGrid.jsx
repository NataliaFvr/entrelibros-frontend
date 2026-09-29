import ProductCard from './ProductCard'
import EmptyState from './EmptyState'

const ProductGrid = ({ libros, topIds, ordenPorVentas, onLimpiar }) => {
  return (
    <div className="grid">
      {libros.length
        ? libros.map((l) => <ProductCard key={l.id} libro={l} masVendido={ordenPorVentas && topIds.has(l.id)} />)
        : <EmptyState onLimpiar={onLimpiar} />}
    </div>
  )
}

export default ProductGrid
