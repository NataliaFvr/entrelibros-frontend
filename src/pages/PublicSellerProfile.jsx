import { useState } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import useVendedorPublico from '../hooks/useVendedorPublico'
import useResenasVendedor from '../hooks/useResenasVendedor'
import useEsAdmin from '../hooks/useEsAdmin'
import AccountTabs from '../componentes/AccountTabs'
import Migas from '../componentes/Migas'
import MiniDeco from '../componentes/MiniDeco'
import SellerPublicHeader from '../componentes/SellerPublicHeader'
import SellerReviews from '../componentes/SellerReviews'
import SellerReviewModal from '../componentes/SellerReviewModal'
import SellerCatalog from '../componentes/SellerCatalog'
import NotFoundPage from './NotFoundPage'

const Perfil = ({ vendedor, libros }) => {
  const { resenias, promedio, miResena, libroComprado, esPropio, puedeResenar, publicar, eliminar } = useResenasVendedor(vendedor.tienda, vendedor.id)
  const esAdmin = useEsAdmin()
  const [modal, setModal] = useState(false)
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'resenias' ? 'resenias' : 'libros' // /vendedor/:id?tab=resenias
  const pestanias = [['libros', `Libros publicados (${libros.length})`], ['resenias', `Reputación y reseñas (${resenias.length})`]]

  const escribir = () => { if (puedeResenar) setModal(true) } // el botón solo existe si puede; esto es una red de seguridad
  const enviar = async (puntos, texto) => {
    if (await publicar(puntos, texto)) setModal(false) // si el back lo rechazó, el modal queda abierto para no perder lo escrito
  }

  return (
    <main className="usr">
      <Migas items={[{ label: 'Libros', to: '/libros' }, { label: vendedor.tienda }]} />
      <SellerPublicHeader vendedor={vendedor} promedio={promedio} cantidad={resenias.length} publicados={libros.length} />
      <AccountTabs pestanias={pestanias} tab={tab} onIr={(t) => setParams(t === 'libros' ? {} : { tab: t }, { replace: true })} />
      {tab === 'libros'
        ? <SellerCatalog tienda={vendedor.tienda} libros={libros} />
        : <SellerReviews resenias={resenias} promedio={promedio} miResena={miResena} esPropio={esPropio} puedeResenar={puedeResenar} onEscribir={escribir} onEliminar={eliminar} moderar={esAdmin} />}
      <MiniDeco />
      {modal && puedeResenar && (
        <SellerReviewModal tienda={vendedor.tienda} libro={libroComprado} inicial={miResena} onPublicar={enviar} onCerrar={() => setModal(false)} />
      )}
    </main>
  )
}

// /vendedor/:id — si el vendedor no existe, muestra el 404
const PublicSellerProfile = () => {
  const { id } = useParams()
  const { cargando, vendedor, libros, redirigirA } = useVendedorPublico(id)

  if (redirigirA != null) return <Navigate to={`/vendedor/${redirigirA}`} replace />
  if (cargando) return <main className="usr" />
  if (!vendedor) return <NotFoundPage />
  return <Perfil key={vendedor.id ?? vendedor.tienda} vendedor={vendedor} libros={libros} />
}

export default PublicSellerProfile
