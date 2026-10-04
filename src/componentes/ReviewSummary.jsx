import Stars from './Stars'

const ReviewSummary = ({ resenias, promedio }) => {
  const n = resenias.length
  return (
    <div className="rev-sum">
      <div className="score fr">{promedio.toFixed(1)}</div>
      <Stars value={promedio} />
      <small>{n} calificaciones</small>
      {[5, 4, 3, 2, 1].map((k) => {
        const c = resenias.filter((r) => r.st === k).length
        return (
          <div key={k} className="drow">
            <span>{k} ★</span>
            <div className="bar"><i style={{ width: `${n ? (c / n) * 100 : 0}%` }} /></div>
            <span>{c}</span>
          </div>
        )
      })}
    </div>
  )
}

export default ReviewSummary
