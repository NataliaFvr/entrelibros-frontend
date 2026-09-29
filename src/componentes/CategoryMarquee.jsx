import { Link } from 'react-router-dom'
import { TONES, textOn } from '../utils/colors'
import Marquee from './Marquee'

const CategoryMarquee = ({ categorias }) => {
  return (
    <div className="cat-wrap">
      <h2>Categorías</h2>
      <Marquee>
        {categorias.map((c, i) => {
          const col = TONES[i % TONES.length]
          return (
            <Link key={c} to={`/libros?cat=${encodeURIComponent(c)}`} className="cat-item">
              <div className="cat-circle" style={{ background: col, color: textOn(col) }}>{c[0]}</div>
              <span>{c}</span>
            </Link>
          )
        })}
      </Marquee>
    </div>
  )
}

export default CategoryMarquee
