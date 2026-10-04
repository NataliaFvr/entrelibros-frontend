import { PRIVACIDAD, TERMINOS } from '../data/legales'
import InfoLayout from '../componentes/InfoLayout'
import LegalDocument from '../componentes/LegalDocument'

const PrivacyPolicyPage = () => {
  const { label, sub, secciones } = PRIVACIDAD
  return (
    <InfoLayout titulo={label} sub={sub} migas={[{ label }]}>
      <LegalDocument secciones={secciones} otro={TERMINOS} />
    </InfoLayout>
  )
}

export default PrivacyPolicyPage
