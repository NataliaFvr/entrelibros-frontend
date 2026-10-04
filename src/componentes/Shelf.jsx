import { Link } from 'react-router-dom'
import { coloresSobre, textOn } from '../utils/colors'
import { fmt } from '../utils/format'
import useShelfCount from '../hooks/useShelfCount'
import FraseLetras from './FraseLetras'

const ALTURAS = [97, 88, 100, 92, 85, 95, 90, 100, 86, 94, 89, 98, 91, 87]

const Lomo = ({ libro, alto }) => {
  return (
    <Link to={`/libro/${libro.id}`} className="spine" style={{ height: `${alto}%`, background: libro.c, color: textOn(libro.c) }}>
      <span className="s-title">{libro.t}</span>
      <div className="s-cover">
        <strong><FraseLetras texto={libro.t} colores={coloresSobre(libro.c)} /></strong>
        <em>{libro.a}</em>
        <b>{fmt(libro.p)}</b>
      </div>
    </Link>
  )
}

// Estantería de "lo más elegido": solo los lomos que entran en el ancho
const Shelf = ({ libros }) => {
  const [ref, n] = useShelfCount(libros.length)
  return (
    <div className="shelf" ref={ref}>
      {libros.slice(0, n).map((l, i) => <Lomo key={l.id} libro={l} alto={ALTURAS[i % ALTURAS.length]} />)}
    </div>
  )
}

export default Shelf
