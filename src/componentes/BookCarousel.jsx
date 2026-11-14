import { useSelector } from 'react-redux'
import useLibroPropio from '../hooks/useLibroPropio'
import BookCard from './BookCard'

// Carrusel horizontal de libros (sin cabecera)
const BookCarousel = ({ libros, max = 9 }) => {
  const user = useSelector((state) => state.user.user)
  const { esPropio } = useLibroPropio(user)
  return (
    <div className="carousel">
      {libros.slice(0, max).map((l) => <BookCard key={l.id} libro={l} propio={esPropio(l)} />)}
    </div>
  )
}

export default BookCarousel
