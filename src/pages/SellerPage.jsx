import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useLibros } from '../hooks/useLibros'
import useVendedor from '../hooks/useVendedor'
import useCalificacionesRecibidas from '../hooks/useCalificacionesRecibidas'
import { ventasDe } from '../services/ventasService'
import { enRevision, precioFinal } from '../services/vendedorService'
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
import SellerReputation from '../componentes/SellerReputation'

const TABS = ['libros', 'nuevo', 'editar', 'ventas', 'estadisticas', 'reputacion']
const Migas = () => <div className="crumbs"><Link to="/">Inicio</Link> › <span>Vender</span></div>

// /vender · /vender/nuevo · /vender/editar/:id · /vender/ventas · /vender/estadisticas · /vender/reputacion
const Vendedor = ({ user }) => {
  const navigate = useNavigate()
  const { tab = 'libros', id } = useParams()
  const { libros } = useLibros()
  const { vendedor, solicitar, aprobarSolicitud, guardarLibro, alternarBaja, aprobarLibro, rechazarLibro } = useVendedor(user)
  const calificaciones = useCalificacionesRecibidas(vendedor.tienda, vendedor.pub)

  if (vendedor.estado !== 'aprobado') {
    return (
      <main className="usr">
        <Migas />
        <AuthHero titulo="Vendé tus libros en Entrelibros" sub="Tu cuenta de comprador + verificación del administrador" />
        <div className="info-wrap">
          {vendedor.estado === 'pendiente'
            ? <SellerPending tienda={vendedor.tienda} onAprobar={aprobarSolicitud} />
            : <SellerRequestForm onEnviar={solicitar} />}
        </div>
        <MiniDeco />
      </main>
    )
  }

  const editado = tab === 'editar' ? vendedor.pub.find((p) => String(p.id) === id) : null
  if (!TABS.includes(tab) || (tab === 'editar' && (!editado || enRevision(editado)))) return <Navigate to="/vender" replace />

  const ventas = ventasDe(vendedor.tienda, libros)
  const vendido = ventas.reduce((suma, v) => suma + v.its.reduce((s, i) => s + i.p * i.q, 0), 0)
  const pestanias = [['libros', 'Mis libros'], ['nuevo', editado ? 'Editar libro' : 'Publicar libro'], ['ventas', 'Historial de ventas'], ['estadisticas', 'Estadísticas'], ['reputacion', 'Reputación']]
  const guardar = (datos) => {
    const respuesta = guardarLibro(datos, editado && editado.id)
    if (respuesta.ok) navigate('/vender')
    return respuesta // si trae { error }, el formulario lo muestra
  }

  return (
    <main className="usr">
      <Migas />
      <SellerHead tienda={vendedor.tienda} publicados={vendedor.pub.filter((p) => p.estado === 'activo').length}
        ventas={ventas.length} vendido={vendido} onMiCuenta={() => navigate('/cuenta')} />
      <AccountTabs pestanias={pestanias} tab={tab === 'editar' ? 'nuevo' : tab} onIr={(t) => navigate(t === 'libros' ? '/vender' : `/vender/${t}`)} />
      {tab === 'libros' && <SellerBooks libros={vendedor.pub} onBaja={alternarBaja} onAprobar={aprobarLibro} onRechazar={rechazarLibro} />}
      {(tab === 'nuevo' || tab === 'editar') && (
        <BookForm key={editado ? editado.id : 'nuevo'} libro={editado ? { ...editado, base: editado.base, p: precioFinal(editado) } : {}}
          onGuardar={guardar} onCancelar={() => navigate('/vender')} />
      )}
      {tab === 'ventas' && <SellerSales ventas={ventas} />}
      {tab === 'estadisticas' && <SellerStats ventas={ventas} />}
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
