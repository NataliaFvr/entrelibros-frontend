import { Link } from 'react-router-dom'

// Cuerpo de una página legal: secciones numeradas + link al otro documento.
// `otro` = el documento hermano ({ to, label }) para ofrecerlo al final.
const LegalDocument = ({ secciones, otro }) => {
  return (
    <div className="info-wrap">
      <div className="card legal-card">
        {secciones.map(({ titulo, texto }) => (
          <section key={titulo}>
            <h3 className="fr">{titulo}</h3>
            <p className="lt">{texto}</p>
          </section>
        ))}
      </div>
      {otro && (
        <p className="info-more" style={{ textAlign: 'center', fontSize: '.85rem', opacity: 0.7 }}>
          También podés leer: <Link to={otro.to}>{otro.label}</Link>
        </p>
      )}
    </div>
  )
}

export default LegalDocument
