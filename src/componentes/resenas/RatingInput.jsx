// Cinco estrellas para elegir una puntuación
const RatingInput = ({ value, onChange }) => {
  return (
    <div className="rvf-st">
      {[1, 2, 3, 4, 5].map((k) => (
        <button key={k} type="button" className={k <= value ? 'on' : ''} aria-label={`${k} estrellas`} onClick={() => onChange(k)}>★</button>
      ))}
    </div>
  )
}

export default RatingInput
