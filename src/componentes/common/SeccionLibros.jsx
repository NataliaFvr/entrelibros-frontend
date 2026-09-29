import { Link } from 'react-router-dom'
import BookCarousel from './BookCarousel'

// Sección de la home: título + "Ver todo" + carrusel. `to` es la URL del catálogo ya filtrado.
export default function SeccionLibros({ titulo, to, libros }) {
  return (
    <section className="sec">
      <div className="sec-head">
        <h2>{titulo}</h2>
        <Link className="view-all" to={to}>Ver todo →</Link>
      </div>
      <BookCarousel libros={libros} />
    </section>
  )
}
