import FraseLetras from './FraseLetras'
import { DecoDerecha, DecoIzquierda } from './TagDeco'

const Tagline = () => {
  return (
    <div className="tag-wrap">
      <DecoIzquierda />
      <p className="tagline"><FraseLetras texto="Cada libro es una puerta a otro mundo" /></p>
      <DecoDerecha />
    </div>
  )
}

export default Tagline
