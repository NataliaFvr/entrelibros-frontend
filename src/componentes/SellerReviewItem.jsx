import Stars from './Stars'

// Las fechas "AAAA-MM-DD" se leen como locales para que no se corran un día
const fecha = (d) => new Date(d.length === 10 ? `${d}T00:00` : d).toLocaleDateString('es-AR')

const SellerReviewItem = ({ resenia }) => {
  const { st, date, nc, libro, t } = resenia
  return (
    <div className="rv">
      <div className="rv-h"><Stars value={st} /><span>{fecha(date)}</span></div>
      <div className="rv-n">{nc}</div>
      {libro && <small className="rv-book">Compró: {libro}</small>}
      <p>{t || 'Sin comentario'}</p>
    </div>
  )
}

export default SellerReviewItem
