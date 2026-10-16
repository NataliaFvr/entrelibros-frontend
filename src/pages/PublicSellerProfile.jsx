import { useState } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
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
  const {
    resenias,
    promedio,
    miResena,
    esPropio,
    esAdmin,
    puedeResenar,
    motivo,
    publicar,
    eliminar,
  } = useResenasVendedor(vendedor.tienda, vendedor.id)
  const [modal, setModal] = useState(false)
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'resenias' ? 'resenias' : 'libros'
  const pestanias = [
    ['libros', `Libros publicados (${libros.length})`],
    ['resenias', `Reputación y reseñas (${resenias.length})`],
  ]

  const escribir = () => {
    if (puedeResenar) setModal(true)
  }
  const enviar = async (puntos, texto) => {
    if (await publicar(puntos, texto)) setModal(false)
  }

  return (
    <main className="usr">
      <Migas items={[{ label: 'Libros', to: '/libros' }, { label: vendedor.tienda }]} />
      <SellerPublicHeader
        vendedor={vendedor}
        promedio={promedio}
        cantidad={resenias.length}
        publicados={libros.length}
      />
      <AccountTabs
        pestanias={pestanias}
        tab={tab}
        onIr={(nuevaTab) => setParams(nuevaTab === 'libros' ? {} : { tab: nuevaTab }, { replace: true })}
      />
      {tab === 'libros'
        ? <SellerCatalog tienda={vendedor.tienda} libros={libros} />
        : (
          <SellerReviews
            resenias={resenias}
            promedio={promedio}
            miResena={miResena}
            esPropio={esPropio}
            esAdmin={esAdmin}
            puedeResenar={puedeResenar}
            motivo={motivo}
            onEscribir={escribir}
            onEliminar={eliminar}
          />
        )}
      <MiniDeco />
      {modal && puedeResenar && (
        <SellerReviewModal
          tienda={vendedor.tienda}
          inicial={miResena}
          onPublicar={enviar}
          onCerrar={() => setModal(false)}
        />
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

  return (
    <Perfil
      key={vendedor.id ?? vendedor.tienda}
      vendedor={vendedor}
      libros={libros}
    />
  )
}

export default PublicSellerProfile
