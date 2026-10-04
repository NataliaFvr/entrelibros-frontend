import { NOSOTROS } from '../data/nosotros'
import InfoLayout from '../componentes/InfoLayout'
import AboutStory from '../componentes/AboutStory'
import AboutArt from '../componentes/AboutArt'

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
