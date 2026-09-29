import BookCarousel from '../common/BookCarousel'

export default function RelatedSection({ titulo, libros }) {
  if (!libros.length) return null
  return (
    <section className="dsec">
      <h2>{titulo}</h2>
      <BookCarousel libros={libros} />
    </section>
  )
}
