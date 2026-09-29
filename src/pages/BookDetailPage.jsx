import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useLibros } from '../hooks/useLibros'
import useResenias from '../hooks/useResenias'
import useRequiereLogin from '../hooks/useRequiereLogin'
import { masVendidos } from '../utils/filtrarLibros'
import BookBreadcrumb from '../componentes/book/BookBreadcrumb'
import Gallery from '../componentes/book/Gallery'
import BookInfo from '../componentes/book/BookInfo'
import BuyBox from '../componentes/book/BuyBox'
import SellerBox from '../componentes/book/SellerBox'
import SpecSection from '../componentes/book/SpecSection'
import DescriptionSection from '../componentes/book/DescriptionSection'
import ReviewsSection from '../componentes/book/ReviewsSection'
import RelatedSection from '../componentes/book/RelatedSection'
import NotFoundPage from './NotFoundPage'

// Stock de ejemplo hasta que el back lo informe
const stockDe = (l) => (l.stock != null ? l.stock : l.usado ? 1 : 1 + ((l.id * 7) % 30))

function Detalle({ libro, libros }) {
  const requiereLogin = useRequiereLogin()
  const { resenias, promedio } = useResenias(libro.id)

  const { rank, delVendedor, mismoAutor, mismaCategoria } = useMemo(() => {
    const otros = libros.filter((x) => x.id !== libro.id)
    return {
      rank: masVendidos(libros).findIndex((x) => x.id === libro.id) + 1,
      delVendedor: libros.filter((x) => x.v === libro.v),
      mismoAutor: otros.filter((x) => x.a === libro.a),
      mismaCategoria: otros.filter((x) => x.cat === libro.cat && x.a !== libro.a),
    }
  }, [libros, libro])

  // TODO: guardar en Marcapáginas / agregar al carrito / comprar cuando exista la sesión y el carrito
  const accion = () => { requiereLogin() }

  return (
    <main className="det">
      <BookBreadcrumb libro={libro} />
      <div className="det-grid">
        <Gallery libro={libro} />
        <BookInfo libro={libro} rank={rank} resumen={{ promedio, cantidad: resenias.length }} guardado={false} onGuardar={accion} />
        <div className="buy-col">
          <BuyBox libro={libro} stock={stockDe(libro)} onComprar={accion} onCarrito={accion} />
          <SellerBox vendedor={libro.v} cantidad={delVendedor.length} />
        </div>
      </div>
      <SpecSection libro={libro} />
      <DescriptionSection libro={libro} />
      {resenias.length > 0 && <ReviewsSection resenias={resenias} promedio={promedio} />}
      <RelatedSection titulo={`Más de ${libro.a}`} libros={mismoAutor} />
      <RelatedSection titulo={`Más de ${libro.cat}`} libros={mismaCategoria} />
      <RelatedSection titulo={`Más libros de ${libro.v}`} libros={delVendedor.filter((x) => x.id !== libro.id)} />
    </main>
  )
}

export default function BookDetailPage() {
  const { id } = useParams()
  const { libros, cargando } = useLibros()
  if (cargando) return <main className="det" />

  const libro = libros.find((l) => l.id === +id)
  if (!libro) return <NotFoundPage ruta={`/libro/${id}`} />
  return <Detalle key={libro.id} libro={libro} libros={libros} />
}
