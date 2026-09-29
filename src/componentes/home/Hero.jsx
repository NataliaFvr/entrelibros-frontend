import Shelf from './Shelf'

export default function Hero({ libros }) {
  return (
    <section className="hero">
      <h1 className="hero-title">¡Lo más elegido!</h1>
      <Shelf libros={libros} />
    </section>
  )
}
