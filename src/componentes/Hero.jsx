import Shelf from './Shelf'

const Hero = ({ libros }) => {
  return (
    <section className="hero">
      <h1 className="hero-title">¡Lo más elegido!</h1>
      <Shelf libros={libros} />
    </section>
  )
}

export default Hero
