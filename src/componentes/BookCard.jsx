import { Link } from 'react-router-dom'
import { coverBg, textOn } from '../utils/colors'
import Precio from './Precio'

// Tarjeta de los carruseles. Es solo un enlace a la ficha: no tiene botones de carrito ni de Marcapáginas.
// `propio` = publicación de quien mira (se marca para que se note que es suya).
const BookCard = ({ libro, propio = false }) => {
  return (
    <Link to={`/libro/${libro.id}`} className="book-card">
      <div className="book-cover" style={{ background: coverBg(libro), color: textOn(libro.c) }}>
        {libro.t}
        {propio && (
          <div className="tags">
            <span className="tg mine">TU PUBLICACIÓN</span>
          </div>
        )}
      </div>
      <div className="book-name">{libro.t}</div>
      <div className="book-author">{libro.a}</div>
      <div className="book-price"><Precio libro={libro} /></div>
    </Link>
  )
}

export default BookCard
