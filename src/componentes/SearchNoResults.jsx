import useLibroPropio from '../hooks/useLibroPropio'
import ProductCard from './ProductCard'
import './SearchResults.css'

// Búsqueda sin coincidencias: mensaje + "Quizás te interesen..." con los bestsellers (`destacados`)
const SearchNoResults = ({ termino, destacados, onLimpiar }) => {
  const { esPropio } = useLibroPropio()
  return (
    <section className="nores">
      <div className="empty" role="status">
        <h3>No encontramos coincidencias para "{termino}"</h3>
        <p>Revisá que esté bien escrito o probá con otro título, autor o librería.</p>
        <button type="button" onClick={onLimpiar}>Ver todos los libros</button>
      </div>
      {destacados.length > 0 && (
        <>
          <h2 className="nores-t">Quizás te interesen nuestros Bestsellers y libros más populares</h2>
          <div className="nores-grid">
            {destacados.map((l) => <ProductCard key={l.id} libro={l} masVendido propio={esPropio(l)} />)}
          </div>
        </>
      )}
    </section>
  )
}

export default SearchNoResults
