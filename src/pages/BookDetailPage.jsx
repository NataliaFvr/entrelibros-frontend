import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLibros } from '../hooks/useLibros'
import useResenias from '../hooks/useResenias'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { useCompra } from '../hooks/useCompra'
import { masVendidos } from '../utils/filtrarLibros'
import BookBreadcrumb from '../componentes/BookBreadcrumb'
import Gallery from '../componentes/Gallery'
import BookInfo from '../componentes/BookInfo'
import BuyBox from '../componentes/BuyBox'
import SellerBox from '../componentes/SellerBox'
import SpecSection from '../componentes/SpecSection'
import DescriptionSection from '../componentes/DescriptionSection'
import ReviewsSection from '../componentes/ReviewsSection'
import RelatedSection from '../componentes/RelatedSection'
import NotFoundPage from './NotFoundPage'

// Stock de ejemplo hasta que el back lo informe
const stockDe = (l) => (l.stock != null ? l.stock : l.usado ? 1 : 1 + ((l.id * 7) % 30))

const Detalle = ({ libro, libros }) => {
  const navigate = useNavigate()
  const toast = useToast()
  const { user, requiereLogin, marks, toggleMark } = useAuth()
  const { agregar } = useCompra()
  const { resenias, promedio, publicar } = useResenias(libro.id)

  const { rank, delVendedor, mismoAutor, mismaCategoria } = useMemo(() => {
    const otros = libros.filter((x) => x.id !== libro.id)
    return {
      rank: masVendidos(libros).findIndex((x) => x.id === libro.id) + 1,
      delVendedor: libros.filter((x) => x.v === libro.v),
      mismoAutor: otros.filter((x) => x.a === libro.a),
      mismaCategoria: otros.filter((x) => x.cat === libro.cat && x.a !== libro.a),
    }
  }, [libros, libro])

  const guardar = () => { if (!requiereLogin('fav')) toggleMark(libro.id) }
  const alCarrito = () => { if (!requiereLogin('cart')) agregar(libro) }
  const publicarOpinion = (st, texto) => {
    publicar({ st, i: -Date.now(), u: `${user.nombre} ${user.apellido[0]}.`, t: texto, w: new Date().toLocaleDateString('es-AR') })
    toast('¡Gracias por tu opinión!')
  }
  const comprar = () => {
    if (requiereLogin('cart')) return
    agregar(libro)
    navigate('/carrito')
  }

  return (
    <main className="det">
      <BookBreadcrumb libro={libro} />
      <div className="det-grid">
        <Gallery libro={libro} />
        <BookInfo libro={libro} rank={rank} resumen={{ promedio, cantidad: resenias.length }} guardado={marks.includes(libro.id)} onGuardar={guardar} />
        <div className="buy-col">
          <BuyBox libro={libro} stock={stockDe(libro)} onComprar={comprar} onCarrito={alCarrito} />
          <SellerBox vendedor={libro.v} cantidad={delVendedor.length} />
        </div>
      </div>
      <SpecSection libro={libro} />
      <DescriptionSection libro={libro} />
      {resenias.length > 0 && <ReviewsSection libroId={libro.id} resenias={resenias} promedio={promedio} onPublicar={publicarOpinion} />}
      <RelatedSection titulo={`Más de ${libro.a}`} libros={mismoAutor} />
      <RelatedSection titulo={`Más de ${libro.cat}`} libros={mismaCategoria} />
      <RelatedSection titulo={`Más libros de ${libro.v}`} libros={delVendedor.filter((x) => x.id !== libro.id)} />
    </main>
  )
}

const BookDetailPage = () => {
  const { id } = useParams()
  const { libros, cargando } = useLibros()
  if (cargando) return <main className="det" />

  const libro = libros.find((l) => l.id === +id)
  if (!libro) return <NotFoundPage ruta={`/libro/${id}`} />
  return <Detalle key={libro.id} libro={libro} libros={libros} />
}

export default BookDetailPage
