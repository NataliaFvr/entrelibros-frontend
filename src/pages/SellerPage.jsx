import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useLibros } from '../hooks/useLibros'
import useVendedor from '../hooks/useVendedor'
import useCalificacionesRecibidas from '../hooks/useCalificacionesRecibidas'
import useVentas from '../hooks/useVentas'
import { enRevision } from '../api/vendedorApi'
import AuthHero from '../componentes/AuthHero'
import AccountTabs from '../componentes/AccountTabs'
import MiniDeco from '../componentes/MiniDeco'
import SellerRequestForm from '../componentes/SellerRequestForm'
import SellerPending from '../componentes/SellerPending'
import SellerHead from '../componentes/SellerHead'
import SellerBooks from '../componentes/SellerBooks'
import BookForm from '../componentes/BookForm'
import SellerSales from '../componentes/SellerSales'
import SellerStats from '../componentes/SellerStats'
import useEstadisticasVendedor from '../hooks/useEstadisticasVendedor'
import SellerReputation from '../componentes/SellerReputation'

const TABS = ['libros', 'nuevo', 'editar', 'ventas', 'estadisticas', 'reputacion']
// Pestaña Estadísticas: datos del back (GET /vendedores/estadisticas).
const Estadisticas = ({ ventas }) => {
  const { datos, error } = useEstadisticasVendedor(ventas)
  return <SellerStats estadisticas={datos} error={error} />
}

const Migas = () => <div className="crumbs"><Link to="/">Inicio</Link> › <span>Vender</span></div>

// /vender · /vender/nuevo · /vender/editar/:id · /vender/ventas · /vender/estadisticas · /vender/reputacion
const Vendedor = ({ user }) => {
  const navigate = useNavigate()
  const { tab = 'libros', id } = useParams()
  const { libros } = useLibros()
  const { vendedor, estadoLibros, reintentar, solicitar, guardarLibro, alternarBaja } = useVendedor(user)
  const calificaciones = useCalificacionesRecibidas(vendedor.tienda, vendedor.pub, user.id)
  const { ventas, cargando } = useVentas(user, vendedor.tienda, libros)

  if (vendedor.estado !== 'aprobado') {
    return (
      <main className="usr">
        <Migas />
        <AuthHero titulo="Vendé tus libros en Entrelibros" sub="Tu cuenta de comprador + verificación del administrador" />
        <div className="info-wrap">
          {vendedor.estado === 'pendiente'
            ? <SellerPending tienda={vendedor.tienda} />
            : <SellerRequestForm onEnviar={solicitar} />}
        </div>
        <MiniDeco />
      </main>
    )
  }

  const editado = tab === 'editar' ? vendedor.pub.find((p) => String(p.id) === id) : null
  if (!TABS.includes(tab) || (tab === 'editar' && (!editado || enRevision(editado)))) return <Navigate to="/vender" replace />

  const vendido = ventas.reduce((suma, v) => suma + v.its.reduce((s, i) => s + i.p * i.q, 0), 0)
  const pestanias = [['libros', 'Mis libros'], ['nuevo', editado ? 'Editar libro' : 'Publicar libro'], ['ventas', 'Historial de ventas'], ['estadisticas', 'Estadísticas'], ['reputacion', 'Reputación']]
  const guardar = async (datos) => {
    const respuesta = await guardarLibro(datos, editado && editado.id)
    if (respuesta.ok) navigate('/vender')
    return respuesta // si trae { error }, el formulario lo muestra
  }

  return (
    <main className="usr">
      <Migas />
      <SellerHead tienda={vendedor.tienda} publicados={vendedor.pub.filter((p) => p.estado === 'activo').length}
        ventas={ventas.length} vendido={vendido} onMiCuenta={() => navigate('/cuenta')} />
      <AccountTabs pestanias={pestanias} tab={tab === 'editar' ? 'nuevo' : tab} onIr={(t) => navigate(t === 'libros' ? '/vender' : `/vender/${t}`)} />
      {tab === 'libros' && <SellerBooks libros={vendedor.pub} estado={estadoLibros} onReintentar={reintentar} onBaja={alternarBaja} />}
      {(tab === 'nuevo' || tab === 'editar') && (
        <BookForm key={editado ? editado.id : 'nuevo'} libro={editado || {}}
          onGuardar={guardar} onCancelar={() => navigate('/vender')} />
      )}
      {tab === 'ventas' && !cargando && <SellerSales ventas={ventas} />}
      {tab === 'estadisticas' && !cargando && <Estadisticas ventas={ventas} />}
      {tab === 'reputacion' && <SellerReputation calificaciones={calificaciones} />}
    </main>
  )
}

const SellerPage = () => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/ingresar" replace state={{ from: '/vender' }} />
  return <Vendedor key={user.nombreUsuario} user={user} />
}

export default SellerPage
