import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLibros } from '../hooks/useLibros'
import useResenias from '../hooks/useResenias'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { useCompra } from '../hooks/useCompra'
import useLibroPropio from '../hooks/useLibroPropio'
import { posicionBestseller } from '../utils/filtrarLibros'
import { esUsado as libroUsado } from '../utils/libro'
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
const stockDe = (l) => (l.stock != null ? l.stock : libroUsado(l) ? 1 : 1 + ((l.id * 7) % 30))

const Detalle = ({ libro, libros }) => {
  const navigate = useNavigate()
  const toast = useToast()
  const { user, requiereLogin, marks, toggleMark } = useAuth()
  const { agregar, compro } = useCompra()
  const { resenias, promedio, publicar } = useResenias(libro.id)

  const { esPropio, rutaEdicion, enRevision } = useLibroPropio()

  const esUsado = libroUsado(libro)
  const propio = esPropio(libro) // el vendedor ve su propia publicación: no la compra ni la guarda

  const { rank, delVendedor, mismoAutor, mismaCategoria } = useMemo(() => {
    const otros = libros.filter((x) => x.id !== libro.id)
    return {
      rank: posicionBestseller(libros, libro), // 0 si es usado: no participa del ranking
      delVendedor: libros.filter((x) => x.v === libro.v),
      mismoAutor: otros.filter((x) => x.a === libro.a),
      mismaCategoria: otros.filter((x) => x.cat === libro.cat && x.a !== libro.a),
    }
  }, [libros, libro])

  const guardar = () => { if (!propio && !requiereLogin('fav')) toggleMark(libro.id) }
  const alCarrito = () => { if (!propio && !requiereLogin('cart')) agregar(libro) }

  const publicarOpinion = async (st, texto) => {
    try {
      await publicar({ st, i: -Date.now(), u: `${user.nombre} ${user.apellido[0]}.`, t: texto, w: new Date().toLocaleDateString('es-AR') })
      toast('¡Gracias por tu opinión!')
    } catch (err) {
      toast(err.message) // con el back: ya reseñaste este ejemplar, compra sin pagar, etc.
    }
  }

  const comprar = () => {
    if (propio || requiereLogin('cart')) return
    agregar(libro) // Solo lo suma al carrito: el Marcapáginas se limpia recién cuando el pago se aprueba
    navigate('/carrito')
  }

  return (
    <main className="det">
      <BookBreadcrumb libro={libro} />
      <div className="det-grid">
        <Gallery libro={libro} />
        <BookInfo 
          libro={libro} 
          rank={rank} 
          resumen={{ promedio, cantidad: resenias.length }} 
          guardado={marks.includes(libro.id)} 
          onGuardar={propio ? undefined : guardar}
        />
        <div className="buy-col">
          <BuyBox libro={libro} stock={stockDe(libro)} onComprar={comprar} onCarrito={alCarrito}
            propio={propio} onEditar={() => navigate(rutaEdicion(libro))} editarDeshabilitado={propio && enRevision(libro)} />
          <SellerBox vendedor={libro.v} cantidad={delVendedor.length} destacarReputacion={esUsado} propio={propio} />
        </div>
      </div>
      <SpecSection libro={libro} />
      <DescriptionSection libro={libro} />
      
      {/* Las opiniones son de la obra: un ejemplar usado no tiene sección de opiniones */}
      {!esUsado && (
        <ReviewsSection resenias={resenias} promedio={promedio} haComprado={Boolean(user) && compro(libro.id)} onPublicar={publicarOpinion} />
      )}

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