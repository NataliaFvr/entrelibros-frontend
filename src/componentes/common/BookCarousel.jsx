import BookCard from './BookCard'

// Carrusel horizontal de libros (sin cabecera)
export default function BookCarousel({ libros, max = 9 }) {
  return (
    <div className="carousel">
      {libros.slice(0, max).map((l) => <BookCard key={l.id} libro={l} />)}
    </div>
  )
}
