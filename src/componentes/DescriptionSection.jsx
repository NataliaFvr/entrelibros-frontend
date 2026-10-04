import { descripcionDe } from '../utils/libro'
import './DescriptionSection.css'

// Sin descripción cargada por el vendedor no se muestra ni la sección ni el título
const DescriptionSection = ({ libro }) => {
  const texto = descripcionDe(libro)
  if (!texto) return null
  return (
    <section className="dsec">
      <h2>Descripción</h2>
      <div className="card desc-card">
        {texto.split(/\n{2,}/).map((parrafo, i) => <p key={i}>{parrafo}</p>)}
      </div>
    </section>
  )
}

export default DescriptionSection
