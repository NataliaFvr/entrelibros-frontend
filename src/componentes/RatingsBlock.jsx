import { plural } from '../utils/format'
import ReviewSummary from './ReviewSummary'
import SellerReviewItem from './SellerReviewItem'
import ReviewItem from './ReviewItem'

// Bloque de calificaciones: resumen por estrellas + lista. `deLibros` usa el formato de las opiniones de libros.
const RatingsBlock = ({ titulo, vacio, resenias, promedio, deLibros = false, cantidad, onMas }) => {
  return (
    <section className="rb">
      <h3 className="fr">{titulo}</h3>
      {resenias.length ? (
        <div className="rev-wrap">
          <ReviewSummary resenias={resenias} promedio={promedio} />
          <div className="rev-list">
            <small className="dim">{resenias.length} {plural(resenias.length, 'calificación', 'calificaciones')}</small>
            {resenias.slice(0, cantidad).map((r) => (deLibros
              ? <ReviewItem key={r.clave} resenia={r} />
              : <SellerReviewItem key={r.id} resenia={r} />))}
            {resenias.length > cantidad && <button className="more" type="button" onClick={onMas}>Ver más</button>}
          </div>
        </div>
      ) : <div className="empty"><p>{vacio}</p></div>}
    </section>
  )
}

export default RatingsBlock
