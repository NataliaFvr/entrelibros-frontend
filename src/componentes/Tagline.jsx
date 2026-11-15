import FraseLetras from './FraseLetras'
import MiniDeco from './MiniDeco'

const Tagline = () => {
  return (
    <div className="tag-wrap">
      <MiniDeco />
      <p className="tagline"><FraseLetras texto="Cada libro es una puerta a otro mundo" /></p>
    </div>
  )
}

export default Tagline
