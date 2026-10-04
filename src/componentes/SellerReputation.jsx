import { useState } from 'react'
import useResenasVendedor from '../hooks/useResenasVendedor'
import { plural } from '../utils/format'
import EmptyBlock from './EmptyBlock'
import ReviewSummary from './ReviewSummary'
import SellerReviewItem from './SellerReviewItem'

const POR_PAGINA = 5

// Pestaña "Reputación" del panel: promedio de estrellas + listado de reseñas de compradores
const SellerReputation = ({ tienda }) => {
  const { resenias, promedio } = useResenasVendedor(tienda)
  const [cantidad, setCantidad] = useState(POR_PAGINA)

  if (!resenias.length) {
    return <EmptyBlock titulo="Todavía no tenés reseñas" texto="Los compradores pueden calificarte desde su historial de compras." />
  }
  return (
    <div className="rev-wrap">
      <ReviewSummary resenias={resenias} promedio={promedio} />
      <div className="rev-list">
        <small className="dim">{resenias.length} {plural(resenias.length, 'reseña', 'reseñas')} de compradores</small>
        {resenias.slice(0, cantidad).map((r) => <SellerReviewItem key={r.id} resenia={r} />)}
        {resenias.length > cantidad && (
          <button className="more" type="button" onClick={() => setCantidad(cantidad + POR_PAGINA)}>Ver más reseñas</button>
        )}
      </div>
    </div>
  )
}

export default SellerReputation
