import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useCompra } from '../hooks/useCompra'
import { useToast } from '../hooks/useToast'
import ReviewSummary from './ReviewSummary'
import ReviewControls from './ReviewControls'
import ReviewForm from './ReviewForm'
import ReviewItem from './ReviewItem'

const ORDEN = {
  hi: (x, y) => y.st - x.st || x.i - y.i,
  lo: (x, y) => x.st - y.st || x.i - y.i,
  new: (x, y) => x.i - y.i,
}
const POR_PAGINA = 5

// Solo puede opinar quien compró el libro (pedido pagado).
// No se renderiza para ejemplares usados: las opiniones son de la obra, no de la publicación de un vendedor.
const ReviewsSection = ({ libroId, resenias, promedio, onPublicar }) => {
  const { requiereLogin } = useAuth()
  const { compro } = useCompra()
  const toast = useToast()
  const [orden, setOrden] = useState('new')
  const [filtro, setFiltro] = useState('')
  const [cantidad, setCantidad] = useState(POR_PAGINA)
  const [formAbierto, setFormAbierto] = useState(false)

  const visibles = resenias.filter((r) => !filtro || r.st === +filtro).sort(ORDEN[orden])
  const cambiar = (setter) => (v) => { setter(v); setCantidad(POR_PAGINA) }

  const opinar = () => {
    if (requiereLogin('review')) return
    if (!compro(libroId)) return toast('Solo podés opinar sobre libros que compraste')
    setFormAbierto(true)
  }

  const publicar = (puntos, texto) => {
    onPublicar(puntos, texto)
    setFormAbierto(false)
    setOrden('new')
    setFiltro('')
    setCantidad(POR_PAGINA)
  }

  return (
    <section className="dsec" id="rev">
      <h2>Opiniones</h2>
      <div className="rev-wrap">
        <ReviewSummary resenias={resenias} promedio={promedio} />
        <div className="rev-list">
          <ReviewControls orden={orden} filtro={filtro} onOrden={cambiar(setOrden)} onFiltro={cambiar(setFiltro)} onOpinar={opinar} />
          {formAbierto && <ReviewForm onPublicar={publicar} onCancelar={() => setFormAbierto(false)} />}
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

export default ReviewsSection
