import { AYUDA, AYUDA_RAIZ } from '../data/ayuda'
import InfoLayout from '../componentes/layout/InfoLayout'
import ContactForm from '../componentes/institucional/ContactForm'
import ContactArt from '../componentes/institucional/ContactArt'

const ContactPage = () => {
  const { label, sub } = AYUDA.contacto
  return (
    <InfoLayout titulo={label} sub={sub} migas={[{ label: 'Ayuda', to: AYUDA_RAIZ }, { label }]}>
      <div className="info-contact">
        <ContactForm />
        <aside className="ct-art">
          <ContactArt />
          <p>Leemos cada mensaje con la misma atención con la que elegimos un buen libro.</p>
        </aside>
      </div>
    </InfoLayout>
  )
}

export default ContactPage
