import { useState } from 'react'
import useRequiereLogin from '../../hooks/useRequiereLogin'
import ReviewSummary from './ReviewSummary'
import ReviewControls from './ReviewControls'
import ReviewItem from './ReviewItem'

const ORDEN = {
  hi: (x, y) => y.st - x.st || x.i - y.i,
  lo: (x, y) => x.st - y.st || x.i - y.i,
  new: (x, y) => x.i - y.i,
}
const POR_PAGINA = 5

export default function ReviewsSection({ resenias, promedio }) {
  const requiereLogin = useRequiereLogin()
  const [orden, setOrden] = useState('new')
  const [filtro, setFiltro] = useState('')
  const [cantidad, setCantidad] = useState(POR_PAGINA)

  const visibles = resenias.filter((r) => !filtro || r.st === +filtro).sort(ORDEN[orden])

  const cambiar = (setter) => (v) => { setter(v); setCantidad(POR_PAGINA) }
  // TODO: publicar reseña (requiere sesión + haber comprado el libro)
  const opinar = () => { requiereLogin() }

  return (
    <section className="dsec" id="rev">
      <h2>Opiniones</h2>
      <div className="rev-wrap">
        <ReviewSummary resenias={resenias} promedio={promedio} />
        <div className="rev-list">
          <ReviewControls orden={orden} filtro={filtro} onOrden={cambiar(setOrden)} onFiltro={cambiar(setFiltro)} onOpinar={opinar} />
          <div>
            {visibles.slice(0, cantidad).map((r) => <ReviewItem key={`${r.u}-${r.i}`} resenia={r} />)}
            {!visibles.length && <p className="d-rate dim" style={{ padding: '16px 0' }}>No hay opiniones con esa calificación.</p>}
          </div>
          {visibles.length > cantidad && (
            <button className="more" type="button" onClick={() => setCantidad(cantidad + POR_PAGINA)}>Ver más opiniones</button>
          )}
        </div>
      </div>
    </section>
  )
}
