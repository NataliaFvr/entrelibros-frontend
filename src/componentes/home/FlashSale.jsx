import { Link } from 'react-router-dom'
import FlashCard from './FlashCard'

// `libros`: los de mayor descuento (ya ordenados)
export default function FlashSale({ libros }) {
  return (
    <section className="flash">
      <div className="flash-inner">
        <div className="flash-left">
          <h2>Descuentos destacados de la semana</h2>
          <p>Los mayores descuentos activos en este momento.</p>
          <Link className="view-all" to="/libros?desc=1&sort=disc">Ver todo →</Link>
        </div>
        <div className="flash-cards">
          {libros.slice(0, 3).map((l) => <FlashCard key={l.id} libro={l} />)}
        </div>
      </div>
    </section>
  )
}
