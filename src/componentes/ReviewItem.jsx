import Stars from './Stars'

const ReviewItem = ({ resenia }) => {
  return (
    <div className="rv">
      <div className="rv-h"><Stars value={resenia.st} /><span>{resenia.w}</span></div>
      <div className="rv-n">{resenia.u}</div>
      {resenia.libro && <small className="rv-book">Sobre: {resenia.libro}</small>}
      <p>{resenia.t}</p>
    </div>
  )
}

export default ReviewItem
