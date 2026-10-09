import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCompra } from '../hooks/useCompra'
import { useLibros } from '../hooks/useLibros'
import { useToast } from '../hooks/useToast'
import { subtotal } from '../utils/pedidos'
import Stepper from '../componentes/Stepper'
import EmptyBlock from '../componentes/EmptyBlock'
import CartList from '../componentes/CartList'
import CartSummary from '../componentes/CartSummary'

const CartPage = () => {
  const navigate = useNavigate()
  const { user, direcciones } = useAuth()
  const { carrito, crearPedido } = useCompra()
  const { libros, cargando } = useLibros()
  const toast = useToast()
  const [elegidaPorUsuario, setElegida] = useState(null) // null = todavía no tocó el selector: se usa la principal
  const [enviando, setEnviando] = useState(false)

  // La dirección que viaja al checkout: la que eligió la persona o, si no eligió, la principal
  const principal = Math.max(0, direcciones.findIndex((d) => d.principal))
  const elegida = Math.min(elegidaPorUsuario ?? principal, Math.max(0, direcciones.length - 1))
  const direccion = direcciones[elegida]

  const items = carrito.map((c) => ({ libro: libros.find((l) => l.id === c.id), q: c.q })).filter((i) => i.libro)
  const precios = items.map(({ libro, q }) => ({ id: libro.id, q, p: libro.p }))
  if (!user) return <Navigate to="/ingresar" replace state={{ from: '/carrito' }} />
  if (cargando) return <main className="usr" />

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
      {items.length === 0 ? (
        <EmptyBlock titulo="Tu estantería está vacía" texto="Sumá libros desde el catálogo para llenarla." boton="Ver libros" onClick={() => navigate('/libros')} />
      ) : (
        <div className="cart-grid">
          <CartList items={items} />
<<<<<<< HEAD
          <CartSummary sub={subtotal(precios)} envio={envio} direcciones={direcciones}
=======
          <CartSummary sub={subtotal(precios)} direcciones={direcciones}
>>>>>>> 726f86e (Union)
            elegida={elegida} onElegir={setElegida} onFinalizar={finalizar} enviando={enviando} />
        </div>
      )}
    </main>
  )
}

export default CartPage
