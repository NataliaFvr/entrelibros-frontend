import Stars from './Stars'
import { fechaCorta } from '../utils/format'

const ReviewItem = ({ resenia }) => {
  return (
    <div className="rv">
      <div className="rv-h"><Stars value={resenia.st} /><span>{resenia.date ? fechaCorta(resenia.date) : resenia.w}</span></div>
      <div className="rv-n">{resenia.u}</div>
      {resenia.libro && <small className="rv-book">Sobre: {resenia.libro}</small>}
      <p>{resenia.t}</p>
    </div>
  )
}

export default ReviewItem
