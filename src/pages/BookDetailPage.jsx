import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLibros } from '../hooks/useLibros'
import useResenias from '../hooks/useResenias'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { useCompra } from '../hooks/useCompra'
import useLibroPropio from '../hooks/useLibroPropio'
import useEsAdmin from '../hooks/useEsAdmin'
import { posicionBestseller } from '../utils/filtrarLibros'
import { categoriasDe, esUsado as libroUsado } from '../utils/libro'
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

const Detalle = ({ libro, libros }) => {
  const navigate = useNavigate()
  const toast = useToast()
  const { user, requiereLogin, marks, toggleMark } = useAuth()
  const { agregar, compro } = useCompra()
  const { resenias, promedio, publicar } = useResenias(libro.id)

  const { esPropio, rutaEdicion, enRevision } = useLibroPropio()
  const esAdmin = useEsAdmin() // el administrador ve la ficha en modo lectura: sin comprar, guardar ni opinar

  const esUsado = libroUsado(libro)
  const propio = esPropio(libro) // el vendedor ve su propia publicación: no la compra ni la guarda

  const { rank, delVendedor, mismoAutor, mismaCategoria } = useMemo(() => {
    const otros = libros.filter((x) => x.id !== libro.id)
    return {
      rank: posicionBestseller(libros, libro), // 0 si es usado: no participa del ranking
      delVendedor: libros.filter((x) => x.v === libro.v),
      mismoAutor: otros.filter((x) => x.a === libro.a),
      mismaCategoria: otros.filter((x) => x.a !== libro.a && categoriasDe(x).some((c) => categoriasDe(libro).includes(c))),
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

  const comprar = async () => {
    if (propio || requiereLogin('cart')) return
    // Solo lo suma al carrito: el Marcapáginas se limpia recién cuando el pago se aprueba.
    // Con el back espera a que el libro esté en el carrito antes de abrir la estantería.
    if (await agregar(libro)) navigate('/carrito')
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
          onGuardar={propio || esAdmin ? undefined : guardar}
        />
        <div className="buy-col">
          <BuyBox libro={libro} stock={libro.stock} onComprar={comprar} onCarrito={alCarrito}
            propio={propio} soloLectura={esAdmin} onEditar={() => navigate(rutaEdicion(libro))} editarDeshabilitado={propio && enRevision(libro)} />
          <SellerBox vendedor={libro.v} vendedorId={libro.vId} cantidad={delVendedor.length} destacarReputacion={esUsado} propio={propio} enlazar={!esAdmin} />
        </div>
      </div>
      <SpecSection libro={libro} />
      <DescriptionSection libro={libro} />
      
      {/* Las opiniones son de la obra: un ejemplar usado no tiene sección de opiniones */}
      {!esUsado && (
        <ReviewsSection resenias={resenias} promedio={promedio} haComprado={Boolean(user) && compro(libro.id)} onPublicar={publicarOpinion} soloLectura={esAdmin} />
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