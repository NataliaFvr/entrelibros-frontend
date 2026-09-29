import { Link } from 'react-router-dom'
import { coverBg, textOn } from '../utils/colors'
import Precio from './Precio'

const BookCard = ({ libro }) => {
  return (
    <Link to={`/libro/${libro.id}`} className="book-card">
      <div className="book-cover" style={{ background: coverBg(libro), color: textOn(libro.c) }}>{libro.t}</div>
      <div className="book-name">{libro.t}</div>
      <div className="book-author">{libro.a}</div>
      <div className="book-price"><Precio libro={libro} /></div>
    </Link>
  )
}

export default BookCard
