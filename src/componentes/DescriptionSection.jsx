import { descripcionDe } from '../utils/libro'

// Sin descripción cargada por el vendedor no se muestra ni la sección ni el título
const DescriptionSection = ({ libro }) => {
  const texto = descripcionDe(libro)
  if (!texto) return null
  return (
    <section className="dsec">
      <h2>Descripción</h2>
      <div className="card">
        {texto.split(/\n{2,}/).map((parrafo, i) => <p key={i} style={{ whiteSpace: 'pre-line' }}>{parrafo}</p>)}
      </div>
    </section>
  )
}

export default DescriptionSection
