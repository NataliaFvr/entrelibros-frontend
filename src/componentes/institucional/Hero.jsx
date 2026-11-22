import Shelf from '../catalogo/Shelf'
import FraseLetras from '../comun/FraseLetras'

const Hero = ({ libros }) => {
  return (
    <section className="hero">
      <h1 className="hero-title"><FraseLetras texto="¡Lo más elegido!" /></h1>
      <Shelf libros={libros} />
    </section>
  )
}

export default Hero
