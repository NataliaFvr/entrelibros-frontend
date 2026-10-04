import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { initials } from '../utils/colors'
import { plural } from '../utils/format'
import { reputacionVendedor } from '../services/resenasVendedorService'
import Stars from './Stars'

// Reputación del vendedor. En un usado (`destacar`) es lo primero que se ve, porque ahí no hay opiniones del libro.
const Reputacion = ({ promedio, cantidad, destacar }) => {
  if (!cantidad) return <div className="sv-meta">Sin reseñas de compradores todavía</div>
  return (
    <div className={destacar ? 'sv-rep destacada' : 'sv-meta'}>
      {destacar ? (
        <>
          <b className="fr">{promedio.toFixed(1)}</b>
          <Stars value={promedio} />
          <small>{cantidad} {plural(cantidad, 'reseña', 'reseñas')} de compradores</small>
        </>
      ) : `★ ${promedio.toFixed(1)} · ${cantidad} ${plural(cantidad, 'reseña', 'reseñas')} de compradores`}
    </div>
  )
}

const SellerBox = ({ vendedor, cantidad, destacarReputacion = false }) => {
  const navigate = useNavigate()
  const rep = useMemo(() => reputacionVendedor(vendedor), [vendedor])
  return (
    <div className="buy">
      <div className="sv-head">
        <span className="sv-av">{initials(vendedor, 2)}</span>
        <div><small>Vendido por</small><b>{vendedor}</b></div>
      </div>
      <Reputacion {...rep} destacar={destacarReputacion} />
      <div className="sv-meta">{cantidad} {plural(cantidad, 'libro publicado', 'libros publicados')}</div>
      <button className="btn alt" type="button" onClick={() => navigate(`/libros?vendedor=${encodeURIComponent(vendedor)}`)}>
        Ver más libros del vendedor
      </button>
    </div>
  )
}

export default SellerBox
