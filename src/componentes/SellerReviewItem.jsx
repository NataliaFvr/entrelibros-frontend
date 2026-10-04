import Stars from './Stars'
import { fechaCorta } from '../utils/format'

const SellerReviewItem = ({ resenia }) => {
  const { st, date, nc, libro, t } = resenia
  return (
    <div className="rv">
      <div className="rv-h"><Stars value={st} /><span>{fechaCorta(date)}</span></div>
      <div className="rv-n">{nc}</div>
      {libro && <small className="rv-book">Compró: {libro}</small>}
      <p>{t || 'Sin comentario'}</p>
    </div>
  )
}

export default SellerReviewItem
