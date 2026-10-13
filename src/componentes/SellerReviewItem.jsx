import Stars from './Stars'
import ConfirmLink from './ConfirmLink'
import { fechaCorta } from '../utils/format'

// `propia`: es la reseña de quien está mirando -> puede editarla (`onEditar`, si todavía puede reseñar) y eliminarla
const SellerReviewItem = ({ resenia, propia = false, onEditar, onEliminar }) => {
  const { st, date, nc, libro, t } = resenia
  return (
    <div className="rv">
      <div className="rv-h"><Stars value={st} /><span>{fechaCorta(date)}</span></div>
      <div className="rv-n">{nc}{propia && ' (vos)'}</div>
      {libro && <small className="rv-book">Compró: {libro}</small>}
      <p>{t || 'Sin comentario'}</p>
      {propia && (
        <div className="rvf-b">
          {onEditar && <button className="more" type="button" onClick={onEditar}>Editar</button>}
          <ConfirmLink className="more" texto="Eliminar" textoConfirmar="¿Seguro? Tocá de nuevo para eliminar" onConfirmar={onEliminar} />
        </div>
      )}
    </div>
  )
}

export default SellerReviewItem
