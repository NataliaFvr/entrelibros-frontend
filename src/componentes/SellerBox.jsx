import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { initials } from '../utils/colors'
import { plural } from '../utils/format'
import { rutaVendedor } from '../utils/vendedor'
import { reputacionVendedor } from '../services/resenasVendedorService'
import Stars from './Stars'
import './SellerPanel.css'

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

// `propio`: el libro es de quien mira la ficha -> en lugar de "ver más libros" se lo lleva a gestionar su tienda
const SellerBox = ({ vendedor, cantidad, destacarReputacion = false, propio = false }) => {
  const navigate = useNavigate()
  const rep = useMemo(() => reputacionVendedor(vendedor), [vendedor])
  return (
    <div className="buy">
      <div className="sv-head">
        <span className="sv-av">{initials(vendedor, 2)}</span>
        <div><small>{propio ? 'Tu publicación' : 'Vendido por'}</small><b><Link to={rutaVendedor(vendedor)} className="lnk">{vendedor}</Link></b></div>
      </div>
      <Reputacion {...rep} destacar={destacarReputacion} />
      <div className="sv-meta">{cantidad} {plural(cantidad, 'libro publicado', 'libros publicados')}</div>
      {propio ? (
        <>
          <p className="note sv-preview">Estás viendo la vista de tu propia publicación.</p>
          <button className="btn main" type="button" onClick={() => navigate('/vender')}>Ir a gestionar mi tienda</button>
        </>
      ) : (
        <button className="btn alt" type="button" onClick={() => navigate(`/libros?vendedor=${encodeURIComponent(vendedor)}`)}>
          Ver más libros del vendedor
        </button>
      )}
    </div>
  )
}

export default SellerBox
