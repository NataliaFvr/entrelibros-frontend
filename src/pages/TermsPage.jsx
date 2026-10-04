import { PRIVACIDAD, TERMINOS } from '../data/legales'
import InfoLayout from '../componentes/InfoLayout'
import LegalDocument from '../componentes/LegalDocument'

const TermsPage = () => {
  const { label, sub, secciones } = TERMINOS
  return (
    <InfoLayout titulo={label} sub={sub} migas={[{ label }]}>
      <LegalDocument secciones={secciones} otro={PRIVACIDAD} />
    </InfoLayout>
  )
}

export default TermsPage
