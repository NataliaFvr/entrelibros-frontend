import { Link } from 'react-router-dom'
import { AYUDA, AYUDA_RAIZ } from '../data/ayuda'
import { PREGUNTAS_FRECUENTES } from '../data/preguntasFrecuentes'
import InfoLayout from '../componentes/InfoLayout'
import FaqAccordion from '../componentes/FaqAccordion'

const FaqPage = () => {
  const { label, sub } = AYUDA.faq
  return (
    <InfoLayout titulo={label} sub={sub} migas={[{ label: 'Ayuda', to: AYUDA_RAIZ }, { label }]}>
      <div className="info-wrap faq">
        <FaqAccordion categorias={PREGUNTAS_FRECUENTES} />
        <p className="info-more" style={{ padding: 0, textAlign: 'center' }}>
          ¿No encontraste lo que buscabas? <Link to={AYUDA.contacto.to}>Escribinos</Link>
        </p>
      </div>
    </InfoLayout>
  )
}

export default FaqPage
