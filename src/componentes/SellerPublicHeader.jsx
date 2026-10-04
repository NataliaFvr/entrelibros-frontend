import { initials } from '../utils/colors'
import { plural } from '../utils/format'
import Stars from './Stars'
import './SellerPanel.css'

// Cabecera pública del vendedor: avatar, nombre, verificado, ubicación y reputación
const SellerPublicHeader = ({ vendedor, promedio, cantidad, publicados }) => {
  const { tienda, usuario, foto, ubicacion, desde, verificado, descripcion } = vendedor

  return (
    <div className="u-head card sp-head">
      {foto
        ? <img className="uav" style={{ width: 84, height: 84 }} src={foto} alt={`Foto de ${tienda}`} />
        : <span className="uav ini" style={{ width: 84, height: 84, fontSize: 30 }}>{initials(tienda, 2).toUpperCase()}</span>}
      <div className="u-id">
        <h1 className="fr">{tienda}</h1>
        {usuario && <p className="sp-user">@{usuario}</p>}
        <div className="sp-tags">
          {verificado && <span className="tg sp-verified">✓ Vendedor verificado</span>}
          {ubicacion && <span>{ubicacion}</span>}
          {desde && <span>En Entrelibros desde {desde}</span>}
          <span>{publicados} {plural(publicados, 'libro publicado', 'libros publicados')}</span>
        </div>
        {descripcion && <p className="sp-desc">{descripcion}</p>}
      </div>
      <div className="sp-rate">
        {cantidad ? (
          <>
            <div><b className="fr">{promedio.toFixed(1)}</b><span className="sp-of"> / 5</span></div>
            <Stars value={promedio} />
            <small>{cantidad} {plural(cantidad, 'reseña', 'reseñas')} de compradores</small>
          </>
        ) : <small>Sin reseñas de compradores todavía</small>}
      </div>
    </div>
  )
}

export default SellerPublicHeader
