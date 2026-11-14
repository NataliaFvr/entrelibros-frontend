/* oxlint-disable no-unused-vars */
import { mostrarToast } from '../redux/toastSlice'
import { abrirGate,cerrarGate as cerrarGateAction,cancelarVerificacion,confirmarEmail,crearDireccion,eliminarDireccion as eliminarDireccionThunk,fetchUsuario,guardarPerfil,limpiarPendiente as limpiarPendienteAction,login as loginThunk,logout as logoutThunk,marcarPrincipal as marcarPrincipalThunk,NOTA_SIN_CONFIRMAR,quitarMarks as quitarMarksThunk,reenviarCodigo,registrar as registrarThunk,toggleMark as toggleMarkThunk } from '../redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useCompra } from '../hooks/useCompra'
import { fetchCotizacion } from '../redux/carritoSlice'
import Stepper from '../componentes/Stepper'
import EmptyBlock from '../componentes/EmptyBlock'
import CartList from '../componentes/CartList'
import CartSummary from '../componentes/CartSummary'
import AvisoCompraPendiente from '../componentes/AvisoCompraPendiente'

const CartPage = () => {
  const navigate = useNavigate()
  const dispatch=useDispatch()
  const {user, direcciones}=useSelector(s=>s.user)
  const { carrito, crearPedido, pedidos } = useCompra()
  const toast = (msg, accion) => dispatch(mostrarToast({ msg, accion }))
  const [elegidaPorUsuario, setElegida] = useState(null) // null = todavía no tocó el selector: se usa la principal
  const [enviando, setEnviando] = useState(false)

  // La dirección que viaja al checkout: la que eligió la persona o, si no eligió, la principal
  const principal = Math.max(0, direcciones.findIndex((d) => d.principal))
  const elegida = Math.min(elegidaPorUsuario ?? principal, Math.max(0, direcciones.length - 1))
  const direccion = direcciones[elegida]

  const items = carrito.map((libro) => ({ libro, q: libro.q }))
  const subtotalCarrito = carrito.reduce((suma, item) => suma + item.subtotal, 0)
  // El back cotiza el envío para la dirección elegida: se ve el total antes de confirmar
  const clave = carrito.map((c) => `${c.id}:${c.q}`).join(',')
  const cotizacion = useSelector((s) => s.carrito.cotizaciones[`${direccion?.id}:${clave}`]) || null
  const errorCotizacion = useSelector((s) => s.carrito.errores[`${direccion?.id}:${clave}`])
  useEffect(() => {
    if (direccion?.id != null && clave && cotizacion == null && !errorCotizacion) {
      dispatch(fetchCotizacion({ idDireccion: direccion.id, clave }))
    }
  }, [dispatch, direccion?.id, clave, cotizacion, errorCotizacion])
  if (!user) return <Navigate to="/ingresar" replace state={{ from: '/carrito' }} />

  const finalizar = async () => {
    if (enviando || !direccion) return
    setEnviando(true)
    try {
      // Con el back crearPedido es async (checkout) y puede fallar: sin stock, libro no disponible, etc.
      const n = await crearPedido(direccion)
      navigate(`/pago/${n}`)
    } catch (err) {
      toast(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="usr">
      <div className="crumbs"><Link to="/">Inicio</Link> › <span>Mi Estantería de Lectura</span></div>
      <Stepper actual={0} />
      <h1 className="fr cart-t">Mi Estantería de Lectura</h1>
      {/* Lo que se confirmó y falta pagar ya no está en la estantería: está en una orden pendiente */}
      <AvisoCompraPendiente pedidos={pedidos} onPagar={(n) => navigate(`/pago/${n}`)} />
      {items.length === 0 ? (
        <EmptyBlock titulo="Tu estantería está vacía" texto="Sumá libros desde el catálogo para llenarla." boton="Ver libros" onClick={() => navigate('/libros')} />
      ) : (
        <div className="cart-grid">
          <div style={{ minWidth: 0 }}>
            <CartList items={items} />
            {/* El carrito está guardado en el back: se puede ir al catálogo y volver sin perder nada */}
            <Link className="lnk" to="/libros" style={{ display: 'inline-block', marginTop: 14 }}>← Seguir comprando</Link>
          </div>
          <CartSummary sub={subtotalCarrito} cotizacion={cotizacion} direcciones={direcciones}
            elegida={elegida} onElegir={setElegida} onFinalizar={finalizar} enviando={enviando} />
        </div>
      )}
    </main>
  )
}

export default CartPage
