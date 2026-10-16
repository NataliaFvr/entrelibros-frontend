import Stars from './Stars'
import ConfirmLink from './ConfirmLink'
import { fechaCorta } from '../utils/format'

// El autor puede editar su reseña; un administrador puede eliminarla.
const SellerReviewItem = ({
  resenia,
  propia = false,
  puedeEliminar = false,
  onEditar,
  onEliminar,
}) => {
  const { st, date, nc, libro, t } = resenia

  return (
    <div className="rv">
      <div className="rv-h">
        <Stars value={st} />
        <span>{fechaCorta(date)}</span>
      </div>
      <div className="rv-n">
        {nc}
        {propia && ' (vos)'}
      </div>
      {libro && <small className="rv-book">Compró: {libro}</small>}
      <p>{t || 'Sin comentario'}</p>

      {(propia || puedeEliminar) && (
        <div className="rvf-b">
          {propia && onEditar && (
            <button className="more" type="button" onClick={onEditar}>
              Editar
            </button>
          )}
          <ConfirmLink
            className="more"
            texto="Eliminar"
            textoConfirmar="¿Seguro? Tocá de nuevo para eliminar"
            onConfirmar={onEliminar}
          />
        </div>
      )}
    </div>
  )
}

export default SellerReviewItem