import { Link } from 'react-router-dom'
import { TONES, initials, textOn } from '../utils/colors'
import { plural } from '../utils/format'
import ItemGrid from './ItemGrid'

// `autores`: [{ nombre, cantidad }], ordenados de más a menos libros
const AuthorGrid = ({ autores }) => {
  return (
    <div className="cat-wrap auth-wrap">
      <h2>Autores destacados</h2>
      <ItemGrid items={autores} verMasTo="/libros"
        render={(a, i) => {
          const col = TONES[(i * 3) % TONES.length]
          return (
            <Link key={a.nombre} to={`/libros?autor=${encodeURIComponent(a.nombre)}`} className="author">
              <div className="avatar" style={{ background: col, color: textOn(col) }}>{initials(a.nombre)}</div>
              <b>{a.nombre}</b>
              <small>{a.cantidad} {plural(a.cantidad, 'libro publicado', 'libros publicados')}</small>
            </Link>
          )
        }} />
    </div>
  )
}

export default AuthorGrid
