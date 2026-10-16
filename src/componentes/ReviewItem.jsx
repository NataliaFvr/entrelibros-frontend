import Stars from './Stars'
import ConfirmLink from './ConfirmLink'
import { fechaCorta } from '../utils/format'

// `moderable`: el admin la puede eliminar (no editar) aunque no sea suya
const ReviewItem = ({ resenia, propia = false, moderable = false, eliminando = false, onEditar, onEliminar }) => {
  const eliminar = <ConfirmLink className="more" texto="Eliminar" textoConfirmar="¿Seguro? Tocá de nuevo para eliminar" disabled={eliminando} onConfirmar={() => onEliminar(resenia.id)} />
  return (
    <div className="rv">
      <div className="rv-h"><Stars value={resenia.st} /><span>{resenia.date ? fechaCorta(resenia.date) : resenia.w}</span></div>
      <div className="rv-n">{resenia.u}</div>
      {resenia.libro && <small className="rv-book">Sobre: {resenia.libro}</small>}
      <p>{resenia.t || 'Sin comentario'}</p>
      {propia && <div className="rvf-b"><button className="more" type="button" onClick={onEditar}>Editar</button>{eliminar}</div>}
      {!propia && moderable && <div className="rvf-b">{eliminar}</div>}
    </div>
  )
}

export default ReviewItem
