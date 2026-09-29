import { Link } from 'react-router-dom'
import { fmt } from '../utils/format'

const FlashCard = ({ libro }) => {
  return (
    <Link to={`/libro/${libro.id}`} className="fcard">
      <span className="badge">{libro.d}% off</span>
      <div className="mini" style={{ background: libro.c }} />
      <div>
        <h3>{libro.t}</h3>
        <small>{libro.a}</small>
        <div className="fprice">{fmt(libro.p)}<s>{fmt(libro.base)}</s></div>
      </div>
    </Link>
  )
}

export default FlashCard
