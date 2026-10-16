import { Link } from 'react-router-dom'
import { coverBg } from '../utils/colors'
import { fmt } from '../utils/format'

// `max` lo manda el back (maxCantidad): los botones se desactivan en los límites, el back igual valida
const CartRow = ({ libro, q, max, onMas, onMenos, onQuitar }) => {
  return (
    <div className="crow">
      <Link to={`/libro/${libro.id}`} className="cmini" style={{ background: coverBg(libro) }} aria-label={libro.t} />
      <div className="cinfo">
        <b><Link className="lnk" to={`/libro/${libro.id}`}>{libro.t}</Link></b>
        <small>{libro.a} · {libro.v}</small>
        <div className="qty">
          <button type="button" aria-label="Menos" onClick={onMenos} disabled={q <= 1}>−</button>
          <span>{q}</span>
          <button type="button" aria-label="Más" onClick={onMas} disabled={q >= max}>+</button>
        </div>
      </div>
      <div className="cprice">
        <b>{fmt(libro.p * q)}</b>
        <button className="lnk" type="button" onClick={onQuitar}>Quitar</button>
      </div>
    </div>
  )
}

export default CartRow
