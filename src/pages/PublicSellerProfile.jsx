import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import useVendedorPublico from '../hooks/useVendedorPublico'
import useResenasVendedor from '../hooks/useResenasVendedor'
import AccountTabs from '../componentes/AccountTabs'
import Migas from '../componentes/Migas'
import MiniDeco from '../componentes/MiniDeco'
import SellerPublicHeader from '../componentes/SellerPublicHeader'
import SellerReviews from '../componentes/SellerReviews'
import SellerReviewModal from '../componentes/SellerReviewModal'
import SellerCatalog from '../componentes/SellerCatalog'
import NotFoundPage from './NotFoundPage'

const Perfil = ({ vendedor, libros }) => {
  const { requiereLogin } = useAuth()
  const toast = useToast()
  const { resenias, promedio, miResena, libroComprado, puedeResenar, publicar } = useResenasVendedor(vendedor.tienda)
  const [modal, setModal] = useState(false)
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'resenias' ? 'resenias' : 'libros' // /vendedor/:id?tab=resenias
  const pestanias = [['libros', `Libros publicados (${libros.length})`], ['resenias', `Reputación y reseñas (${resenias.length})`]]

  const escribir = () => {
    if (requiereLogin('review')) return
    if (!puedeResenar) return toast('Solo podés calificar a vendedores a los que ya les compraste')
    setModal(true)
  }
  const enviar = (puntos, texto) => {
    publicar(puntos, texto)
    setModal(false)
  }

  return (
    <main className="usr">
      <Migas items={[{ label: 'Libros', to: '/libros' }, { label: vendedor.tienda }]} />
      <SellerPublicHeader vendedor={vendedor} promedio={promedio} cantidad={resenias.length} publicados={libros.length} />
      <AccountTabs pestanias={pestanias} tab={tab} onIr={(t) => setParams(t === 'libros' ? {} : { tab: t }, { replace: true })} />
      {tab === 'libros'
        ? <SellerCatalog tienda={vendedor.tienda} libros={libros} />
        : <SellerReviews resenias={resenias} promedio={promedio} miResena={miResena} onEscribir={escribir} />}
      <MiniDeco />
      {modal && (
        <SellerReviewModal tienda={vendedor.tienda} libro={libroComprado} inicial={miResena} onPublicar={enviar} onCerrar={() => setModal(false)} />
      )}
    </main>
  )
}

// /vendedor/:id — si el vendedor no existe, muestra el 404
const PublicSellerProfile = () => {
  const { id } = useParams()
  const { cargando, vendedor, libros } = useVendedorPublico(id)

  if (cargando) return <main className="usr" />
  if (!vendedor) return <NotFoundPage />
  return <Perfil key={vendedor.tienda} vendedor={vendedor} libros={libros} />
}

export default PublicSellerProfile
