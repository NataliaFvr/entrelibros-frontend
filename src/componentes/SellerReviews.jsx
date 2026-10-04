import { useState } from 'react'
import ReviewSummary from './ReviewSummary'
import SellerReviewItem from './SellerReviewItem'
import './SellerPanel.css'

const POR_PAGINA = 5

// Módulo de reseñas de compradores: resumen por estrellas + listado.
// El botón de escribir solo aparece si `puedeResenar`; el dueño de la tienda ve un aviso en su lugar.
const SellerReviews = ({ resenias, promedio, miResena, esPropio, puedeResenar, onEscribir }) => {
  const [cantidad, setCantidad] = useState(POR_PAGINA)

  return (
    <section className="dsec" id="resenias">
      <h2>Reseñas de compradores</h2>
      {esPropio && (
        <p className="note sp-owner" role="status"><b>Esta es la vista pública de tu reputación</b></p>
      )}
      <div className={`rev-wrap sp-rev-wrap${resenias.length ? '' : ' solo'}`}>
        {resenias.length > 0 && <ReviewSummary resenias={resenias} promedio={promedio} />}
        <div className="rev-list sp-rev-list">
          <div className="sp-rev-head">
            <small className="dim">{resenias.length ? 'Opiniones de quienes ya le compraron' : 'Todavía no hay reseñas.'}</small>
            {puedeResenar && (
              <button className="more" style={{ margin: 0 }} type="button" onClick={onEscribir}>
                {miResena ? 'Editar mi reseña' : 'Escribir una reseña al vendedor'}
              </button>
            )}
          </div>
          {!esPropio && !puedeResenar && (
            <p className="note" role="note">Solo los compradores que hayan adquirido un libro de este vendedor pueden dejar una reseña.</p>
          )}
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
