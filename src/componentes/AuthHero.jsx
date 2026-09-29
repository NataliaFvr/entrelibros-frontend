import FraseLetras from './FraseLetras'
import { DecoDerecha, DecoIzquierda } from './TagDeco'

const AuthHero = ({ titulo, sub }) => {
  return (
    <div className="tag-wrap au-hero">
      <DecoIzquierda />
      <h1 className="tagline"><FraseLetras texto={titulo} /></h1>
      <p className="tag-sub">{sub}</p>
      <DecoDerecha />
    </div>
  )
}

export default AuthHero
