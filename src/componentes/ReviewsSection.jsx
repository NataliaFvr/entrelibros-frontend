import { useState } from 'react'
import ReviewSummary from './ReviewSummary'
import ReviewControls from './ReviewControls'
import ReviewForm from './ReviewForm'
import ReviewItem from './ReviewItem'

const ORDEN = {
  hi: (x, y) => y.st - x.st || y.i - x.i,
  lo: (x, y) => x.st - y.st || y.i - x.i,
  new: (x, y) => y.i - x.i, // las nuevas primero: el id crece con cada reseña
}
const POR_PAGINA = 5

// El backend informa si la sesión puede opinar. No se renderiza para ejemplares
// usados: las opiniones son de la obra, no de la publicación de un vendedor.
const ReviewsSection = ({ resenias, promedio, miResenia, puedeResenar, motivo, onPublicar, onEliminar, soloLectura = false, moderar = false }) => {
  const [orden, setOrden] = useState('new')
  const [filtro, setFiltro] = useState('')
  const [cantidad, setCantidad] = useState(POR_PAGINA)
  const [formAbierto, setFormAbierto] = useState(false)
  const [editando, setEditando] = useState(null)

  const visibles = resenias.filter((r) => !filtro || r.st === +filtro).sort(ORDEN[orden])
  const cambiar = (setter) => (v) => { setter(v); setCantidad(POR_PAGINA) }

  const opinar = () => {
    setEditando(miResenia)
    setFormAbierto(true)
  }

  // `onPublicar` devuelve false si el back lo rechazó: el formulario queda abierto para no perder lo escrito
  const publicar = async (puntos, texto) => {
    if ((await onPublicar(puntos, texto)) === false) return
    setFormAbierto(false)
    setEditando(null)
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
          <ReviewControls orden={orden} filtro={filtro} onOrden={cambiar(setOrden)} onFiltro={cambiar(setFiltro)} onOpinar={soloLectura ? undefined : opinar} puedeOpinar={puedeResenar} motivo={motivo} yaOpino={Boolean(miResenia)} />
          {formAbierto && <ReviewForm key={editando?.id || 'nueva'} inicial={editando} onPublicar={publicar} onCancelar={() => { setFormAbierto(false); setEditando(null) }} />}
          <div>
            {visibles.slice(0, cantidad).map((r) => <ReviewItem key={`${r.u}-${r.i}`} resenia={r}
              propia={!soloLectura && miResenia?.id === r.id} moderable={moderar} onEditar={() => { setEditando(r); setFormAbierto(true) }} onEliminar={onEliminar} />)}
            {!resenias.length && (
              <div className="empty" style={{ marginTop: 12 }}>
                <h3>Este libro todavía no tiene opiniones</h3>
                <p>{puedeResenar ? 'Si ya lo leíste, ¡sé la primera persona en opinar!' : (motivo || 'Las opiniones las dejan quienes compraron el libro.')}</p>
              </div>
            )}
            {resenias.length > 0 && !visibles.length && <p className="d-rate dim" style={{ padding: '16px 0' }}>No hay opiniones con esa calificación.</p>}
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
