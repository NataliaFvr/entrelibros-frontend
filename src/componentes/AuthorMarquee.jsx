import { Link } from 'react-router-dom'
import { TONES, initials, textOn } from '../utils/colors'
import { plural } from '../utils/format'
import Marquee from './Marquee'

// `autores`: [{ nombre, cantidad }]
const AuthorMarquee = ({ autores }) => {
  return (
    <div className="cat-wrap auth-wrap">
      <h2>Autores destacados</h2>
      <Marquee>
        {autores.map((a, i) => {
          const col = TONES[(i * 3) % TONES.length]
          return (
            <Link key={a.nombre} to={`/libros?autor=${encodeURIComponent(a.nombre)}`} className="author">
              <div className="avatar" style={{ background: col, color: textOn(col) }}>{initials(a.nombre)}</div>
              <b>{a.nombre}</b>
              <small>{a.cantidad} {plural(a.cantidad, 'libro publicado', 'libros publicados')}</small>
            </Link>
          )
        })}
      </Marquee>
    </div>
  )
}

export default AuthorMarquee
