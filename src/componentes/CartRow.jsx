import { Link } from 'react-router-dom'
import { coverBg } from '../utils/colors'
import { fmt } from '../utils/format'

const CartRow = ({ libro, q, onMas, onMenos, onQuitar }) => {
  return (
    <div className="crow">
      <Link to={`/libro/${libro.id}`} className="cmini" style={{ background: coverBg(libro) }} aria-label={libro.t} />
      <div className="cinfo">
        <b><Link className="lnk" to={`/libro/${libro.id}`}>{libro.t}</Link></b>
        <small>{libro.a} · {libro.v}</small>
        <div className="qty">
          <button type="button" aria-label="Menos" onClick={onMenos}>−</button>
          <span>{q}</span>
          <button type="button" aria-label="Más" onClick={onMas}>+</button>
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
