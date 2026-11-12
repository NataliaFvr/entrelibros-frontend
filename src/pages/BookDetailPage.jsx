import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useLibros } from '../hooks/useLibros'
import { fetchLibro } from '../redux/librosSlice'
import useResenias from '../hooks/useResenias'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { useCompra } from '../hooks/useCompra'
import useLibroPropio from '../hooks/useLibroPropio'
import useEsAdmin from '../hooks/useEsAdmin'
import { posicionBestseller } from '../utils/filtrarLibros'
import { categoriasDe, esUsado } from '../utils/libro'
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
  const [params] = useSearchParams()
  const toast = useToast()
  const { user, requiereLogin, marks, toggleMark, pendiente, limpiarPendiente } = useAuth()
  const { agregar } = useCompra()
  const { resenias, promedio, miResenia, puedeResenar, motivo, publicar, eliminar } = useResenias(libro.id)

  const { esPropio } = useLibroPropio()
  const esAdmin = useEsAdmin() // El administrador ve la ficha en modo lectura: sin comprar, guardar ni opinar, pero puede eliminar opiniones.

  const usado = esUsado(libro)
  const propio = esPropio(libro)

  const { rank, delVendedor, mismoAutor, mismaCategoria } = useMemo(() => {
    const otros = libros.filter((x) => x.id !== libro.id)

    return {
      rank: posicionBestseller(libros, libro),
      delVendedor: libros.filter((x) => x.v === libro.v),
      mismoAutor: otros.filter((x) => x.a === libro.a),
      mismaCategoria: otros.filter(
        (x) =>
          x.a !== libro.a &&
          categoriasDe(x).some((c) => categoriasDe(libro).includes(c)),
      ),
    }
  }, [libros, libro])

  // Si tocó Añadir, Comprar o Guardar antes de iniciar sesión, al volver logueado se completa solo
  useEffect(() => {
    if (!user || !pendiente || pendiente.idLibro !== libro.id) return
    limpiarPendiente()
    if (esAdmin) return // el admin no compra ni guarda
    if (pendiente.tipo === 'fav') {
      if (!marks.includes(libro.id)) toggleMark(libro.id)
      return
    }
    agregar(libro, pendiente.cantidad).then((ok) => { if (ok && pendiente.tipo === 'buy') navigate('/carrito') })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, pendiente, libro.id])

  const guardar = () => {
    if (!requiereLogin('fav', null, { tipo: 'fav', idLibro: libro.id })) toggleMark(libro.id)
  }

  const alCarrito = (cantidad) => {
    if (!requiereLogin('cart', null, { tipo: 'cart', idLibro: libro.id, cantidad })) agregar(libro, cantidad)
  }

  const publicarOpinion = async (st, texto) => {
    try {
      await publicar({
        st,
        i: -Date.now(),
        u: `${user.nombre} ${user.apellido[0]}.`,
        t: texto,
        w: new Date().toLocaleDateString('es-AR'),
      })
      toast(miResenia ? 'Opinión actualizada' : '¡Gracias por tu opinión!')
      return true
    } catch (err) {
      toast(err.message)
      return false
    }
  }

  const eliminarOpinion = async (id) => {
    try {
      await eliminar(id)
      toast('Opinión eliminada')
    } catch (err) {
      toast(err.message)
    }
  }

  const comprar = async (cantidad) => {
    if (requiereLogin('cart', null, { tipo: 'buy', idLibro: libro.id, cantidad })) return

    // Solo suma el libro al carrito; el marcapáginas se limpia cuando se aprueba el pago.
    if (await agregar(libro, cantidad)) navigate('/carrito')
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
          onGuardar={esAdmin ? undefined : guardar}
        />

        <div className="buy-col">
          <BuyBox
            libro={libro}
            stock={libro.stock}
            onComprar={comprar}
            onCarrito={alCarrito}
            soloLectura={esAdmin}
          />

          <SellerBox
            vendedor={libro.v}
            vendedorId={libro.vId}
            cantidad={delVendedor.length}
            destacarReputacion={usado}
            propio={propio}
          />
        </div>
      </div>

      <SpecSection libro={libro} />
      <DescriptionSection libro={libro} />

      <ReviewsSection
        resenias={resenias}
        promedio={promedio}
        miResenia={miResenia}
        puedeResenar={puedeResenar}
        motivo={motivo}
        onPublicar={publicarOpinion}
        onEliminar={eliminarOpinion}
        soloLectura={esAdmin}
        moderar={esAdmin}
        abrirAlCargar={params.get('opinar') === '1'}
      />

      <RelatedSection titulo={`Más de ${libro.a}`} libros={mismoAutor} />
      <RelatedSection titulo={`Más de ${libro.cat}`} libros={mismaCategoria} />
      <RelatedSection
        titulo={`Más libros de ${libro.v}`}
        libros={delVendedor.filter((x) => x.id !== libro.id)}
      />
    </main>
  )
}

const BookDetailPage = () => {
  const { id } = useParams()
  const { libros, cargando } = useLibros()
  const dispatch = useDispatch()
  const delCatalogo = libros.find((l) => l.id === +id)
  // El catálogo no lista los agotados: si no está, se pide ese libro (undefined = todavía no se pidió)
  const suelto = useSelector((state) => state.libros.sueltos[+id])

  useEffect(() => {
    if (!cargando && !delCatalogo && suelto === undefined) dispatch(fetchLibro(+id))
  }, [dispatch, id, cargando, delCatalogo, suelto])

  if (cargando || (!delCatalogo && suelto === undefined)) return <main className="det" />

  const libro = delCatalogo || suelto
  if (!libro) return <NotFoundPage ruta={`/libro/${id}`} />

  return <Detalle key={libro.id} libro={libro} libros={libros} />
}

export default BookDetailPage
