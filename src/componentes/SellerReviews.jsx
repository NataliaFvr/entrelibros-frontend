import { useState } from 'react'
import ReviewSummary from './ReviewSummary'
import SellerReviewItem from './SellerReviewItem'

const POR_PAGINA = 5

// Módulo de reseñas de compradores: resumen por estrellas + listado + botón para escribir una
const SellerReviews = ({ resenias, promedio, miResena, onEscribir }) => {
  const [cantidad, setCantidad] = useState(POR_PAGINA)

  return (
    <section className="dsec" id="resenias">
      <h2>Reseñas de compradores</h2>
      <div className="rev-wrap">
        {resenias.length > 0 && <ReviewSummary resenias={resenias} promedio={promedio} />}
        <div className="rev-list sp-rev-list">
          <div className="sp-rev-head">
            <small className="dim">{resenias.length ? 'Opiniones de quienes ya le compraron' : 'Todavía no hay reseñas.'}</small>
            <button className="more" style={{ margin: 0 }} type="button" onClick={onEscribir}>
              {miResena ? 'Editar mi reseña' : 'Escribir una reseña al vendedor'}
            </button>
          </div>
          {resenias.slice(0, cantidad).map((r) => <SellerReviewItem key={r.id} resenia={r} />)}
          {resenias.length > cantidad && (
            <button className="more" type="button" onClick={() => setCantidad(cantidad + POR_PAGINA)}>Ver más reseñas</button>
          )}
        </div>
      </div>
    </section>
  )
}

export default SellerReviews
