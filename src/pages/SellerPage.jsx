import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { urlFotoUsuario } from '../api/usuariosApi'
import { enRevision } from '../api/vendedorApi'
import AccountTabs from '../componentes/AccountTabs'
import AuthHero from '../componentes/AuthHero'
import BookForm from '../componentes/BookForm'
import MiniDeco from '../componentes/MiniDeco'
import SellerBooks from '../componentes/SellerBooks'
import SellerHead from '../componentes/SellerHead'
import SellerPending from '../componentes/SellerPending'
import SellerReputation from '../componentes/SellerReputation'
import SellerRequestForm from '../componentes/SellerRequestForm'
import SellerSales from '../componentes/SellerSales'
import SellerStats from '../componentes/SellerStats'
import useCalificacionesRecibidas from '../hooks/useCalificacionesRecibidas'
import useEstadisticasVendedor from '../hooks/useEstadisticasVendedor'
import useVendedor from '../hooks/useVendedor'
import useVentas from '../hooks/useVentas'

const TABS = ['libros', 'nuevo', 'editar', 'ventas', 'estadisticas', 'reputacion']
// Pestaña Estadísticas: datos del back (GET /vendedores/estadisticas).
const Estadisticas = () => {
  const dispatch = useDispatch()
  const { estadisticas, errorEstadisticas } = useSelector((state) => state.ventas)
  const { datos, error } = useEstadisticasVendedor({ dispatch, estadisticas, errorEstadisticas })
  return <SellerStats estadisticas={datos} error={error} />
}

const Migas = () => <div className="crumbs"><Link to="/">Inicio</Link> › <span>Vender</span></div>

// /vender · /vender/nuevo · /vender/editar/:id · /vender/ventas · /vender/estadisticas · /vender/reputacion
const Vendedor = ({ user, perfil }) => {
  const navigate = useNavigate()
  const { tab = 'libros', id } = useParams()
  const dispatch = useDispatch()
  const estadoVendedor = useSelector((state) => state.vendedor)
  const estadoVentas = useSelector((state) => state.ventas)
  const estadoResenas = useSelector((state) => state.resenas)
  const { vendedor, estadoLibros, faltanFotos, reintentar, solicitar, guardarLibro, alternarBaja } = useVendedor(user, tab === 'editar' ? id : null, { dispatch, ...estadoVendedor })
  const calificaciones = useCalificacionesRecibidas(vendedor.tienda, vendedor.pub, user.id, { dispatch, ...estadoResenas })
  const { ventas, cargando, cancelar } = useVentas(user, { dispatch, ...estadoVentas })
  const activas = useMemo(() => ventas.filter((v) => v.estado === 'pagada'), [ventas]) // solo las pagadas suman a totales y estadísticas

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
  // Al abrir o recargar /vender/editar/:id hay que esperar a que lleguen los libros antes de decidir si existe
  // (y a que lleguen todas sus fotos: en la lista solo está la portada)
  if (tab === 'editar' && (estadoLibros === 'cargando' || faltanFotos)) return <main className="usr" />
  if (!TABS.includes(tab) || (tab === 'editar' && (!editado || enRevision(editado)))) return <Navigate to="/vender" replace />

  const vendido = activas.reduce((suma, v) => suma + v.its.reduce((s, i) => s + i.p * i.q, 0), 0)
  const pestanias = [['libros', 'Mis libros'], ['nuevo', editado ? 'Editar libro' : 'Publicar libro'], ['ventas', 'Historial de ventas'], ['estadisticas', 'Estadísticas'], ['reputacion', 'Reputación']]
  const guardar = async (datos) => {
    const respuesta = await guardarLibro(datos, editado && editado.id)
    if (respuesta.ok) navigate('/vender')
    return respuesta // si trae { error }, el formulario lo muestra
  }

  return (
    <main className="usr">
      <Migas />
      <SellerHead tienda={vendedor.tienda} user={user} perfil={perfil} publicados={vendedor.pub.filter((p) => p.estado === 'activo').length}
        ventas={activas.length} vendido={vendido} onMiCuenta={() => navigate('/cuenta')} />
      <AccountTabs pestanias={pestanias} tab={tab === 'editar' ? 'nuevo' : tab} onIr={(t) => navigate(t === 'libros' ? '/vender' : `/vender/${t}`)} />
      {tab === 'libros' && <SellerBooks libros={vendedor.pub} estado={estadoLibros} onReintentar={reintentar} onBaja={alternarBaja} />}
      {(tab === 'nuevo' || tab === 'editar') && (
        <BookForm key={editado ? editado.id : 'nuevo'} libro={editado || {}}
          onGuardar={guardar} onCancelar={() => navigate('/vender')} />
      )}
      {tab === 'ventas' && !cargando && <SellerSales ventas={ventas} onCancelar={cancelar} />}
      {tab === 'estadisticas' && !cargando && <Estadisticas />}
      {tab === 'reputacion' && <SellerReputation calificaciones={calificaciones} />}
    </main>
  )
}

const SellerPage = () => {
  const {user}=useSelector(s=>s.user)

  const perfil=user?{avatar:user.avatar||'',foto:user.tieneFoto?urlFotoUsuario(user.id):''}:{}
  if (!user) return <Navigate to="/ingresar" replace state={{ from: '/vender' }} />
  return <Vendedor key={user.nombreUsuario} user={user} perfil={perfil} />
}

export default SellerPage