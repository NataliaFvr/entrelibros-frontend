import { Link } from 'react-router-dom'
import { initials } from '../utils/colors'
import { plural } from '../utils/format'
import { rutaVendedor } from '../utils/vendedor'
import useEsAdmin from '../hooks/useEsAdmin'
import './SearchResults.css'

// Vendedores que coinciden con la búsqueda: tarjetas con enlace directo a su perfil público (/vendedor/:id)
const SellerMatches = ({ tiendas }) => {
  const esAdmin = useEsAdmin()
  if (!tiendas.length || esAdmin) return null // el admin no tiene perfiles públicos de tienda a los que ir
  return (
    <section className="sm" aria-label="Vendedores que coinciden con tu búsqueda">
      <h2>{plural(tiendas.length, 'Vendedor', 'Vendedores')}</h2>
      <div className="sm-list">
        {tiendas.map(({ tienda, cantidad }) => (
          <Link key={tienda} to={rutaVendedor(tienda)} className="sm-card">
            <span className="sm-av">{initials(tienda, 2).toUpperCase()}</span>
            <span className="sm-txt"><b>{tienda}</b><small>{cantidad} {plural(cantidad, 'libro publicado', 'libros publicados')}</small></span>
            <span className="sm-go">Ver perfil →</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default SellerMatches
