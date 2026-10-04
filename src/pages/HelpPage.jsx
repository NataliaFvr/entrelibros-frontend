import { Link } from 'react-router-dom'
import { AYUDA_LINKS } from '../data/ayuda'
import InfoLayout from '../componentes/InfoLayout'

// Centro de ayuda: puerta de entrada a Contacto, Preguntas frecuentes y Envíos
const HelpPage = () => {
  return (
    <InfoLayout titulo="Centro de ayuda" sub="¿En qué te podemos dar una mano?" migas={[{ label: 'Ayuda' }]}>
      <div className="info-wrap">
        <div className="help-grid">
          {AYUDA_LINKS.map((l, i) => (
            <Link key={l.to} to={l.to} className={`card ship-c help-card${i % 2 ? ' d' : ''}`}>
              <h3 className="fr">{l.label}</h3>
              <p>{l.sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </InfoLayout>
  )
}

export default HelpPage
