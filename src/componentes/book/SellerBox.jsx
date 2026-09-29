import { useNavigate } from 'react-router-dom'
import { initials, } from '../../utils/colors'
import { plural } from '../../utils/format'

export default function SellerBox({ vendedor, cantidad }) {
  const navigate = useNavigate()
  return (
    <div className="buy">
      <div className="sv-head">
        <span className="sv-av">{initials(vendedor, 2)}</span>
        <div><small>Vendido por</small><b>{vendedor}</b></div>
      </div>
      <div className="sv-meta">{cantidad} {plural(cantidad, 'libro publicado', 'libros publicados')}</div>
      <button className="btn alt" type="button" onClick={() => navigate(`/libros?vendedor=${encodeURIComponent(vendedor)}`)}>
        Ver más libros del vendedor
      </button>
    </div>
  )
}
