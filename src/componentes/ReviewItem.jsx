import Stars from './Stars'
import { fechaCorta } from '../utils/format'

const ReviewItem = ({ resenia, propia = false, onEditar, onEliminar }) => {
  return (
    <div className="rv">
      <div className="rv-h"><Stars value={resenia.st} /><span>{resenia.date ? fechaCorta(resenia.date) : resenia.w}</span></div>
      <div className="rv-n">{resenia.u}</div>
      {resenia.libro && <small className="rv-book">Sobre: {resenia.libro}</small>}
      <p>{resenia.t}</p>
      {propia && <div className="rvf-b"><button className="more" type="button" onClick={onEditar}>Editar</button><button className="more" type="button" onClick={onEliminar}>Eliminar</button></div>}
    </div>
  )
}

export default ReviewItem
