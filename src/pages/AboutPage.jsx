import { NOSOTROS } from '../data/nosotros'
import InfoLayout from '../componentes/layout/InfoLayout'
import AboutStory from '../componentes/institucional/AboutStory'
import AboutArt from '../componentes/institucional/AboutArt'

const AboutPage = () => {
  const { label, sub } = NOSOTROS
  return (
    <InfoLayout titulo={label} sub={sub} migas={[{ label }]}>
      <div className="info-contact">
        <AboutStory />
        <aside className="ct-art">
          <AboutArt />
        </aside>
      </div>
    </InfoLayout>
  )
}

export default AboutPage
