import { Link } from 'react-router-dom'
import { coverBg, textOn } from '../utils/colors'
import Precio from './Precio'

// Tarjeta del catálogo, con etiquetas (más vendido / usado / % off). `propio` = publicación de quien mira
const ProductCard = ({ libro, masVendido, propio = false }) => {
  return (
    <Link to={`/libro/${libro.id}`} className="pcard">
      <div className="pcover" style={{ background: coverBg(libro), color: textOn(libro.c) }}>
        {libro.t}
        <div className="tags">
          {propio && <span className="tg mine">TU PUBLICACIÓN</span>}
          {masVendido && <span className="tg">MÁS VENDIDO</span>}
          {libro.usado && <span className="tg used">USADO</span>}
          {libro.d > 0 && <span className="tg off">{libro.d}% OFF</span>}
        </div>
      </div>
      <div className="pname">{libro.t}</div>
      <div className="pauthor">{libro.a}</div>
      <div className="pmeta">{libro.cat} · {libro.ed} · {libro.anio}</div>
      <div className="pprice"><Precio libro={libro} /></div>
    </Link>
  )
}

export default ProductCard
