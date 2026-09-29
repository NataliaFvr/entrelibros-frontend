import ProductCard from '../common/ProductCard'
import EmptyState from './EmptyState'

export default function ProductGrid({ libros, topIds, ordenPorVentas, onLimpiar }) {
  return (
    <div className="grid">
      {libros.length
        ? libros.map((l) => <ProductCard key={l.id} libro={l} masVendido={ordenPorVentas && topIds.has(l.id)} />)
        : <EmptyState onLimpiar={onLimpiar} />}
    </div>
  )
}
