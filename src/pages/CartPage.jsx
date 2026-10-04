import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCompra } from '../hooks/useCompra'
import { useLibros } from '../hooks/useLibros'
import { costoEnvio } from '../utils/envio'
import { direccionTexto } from '../utils/format'
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
  const [elegida, setElegida] = useState(0)

  if (!user) return <Navigate to="/ingresar" replace state={{ from: '/carrito' }} />
  if (cargando) return <main className="usr" />

  const items = carrito.map((c) => ({ libro: libros.find((l) => l.id === c.id), q: c.q })).filter((i) => i.libro)
  const precios = items.map(({ libro, q }) => ({ id: libro.id, q, p: libro.p }))

  const finalizar = () => {
    const n = crearPedido(direccionTexto(direcciones[Math.min(elegida, direcciones.length - 1)]))
    navigate(`/pago/${n}`)
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
          <CartList items={items} libros={libros} />
          <CartSummary sub={subtotal(precios)} envio={costoEnvio(precios, libros)} direcciones={direcciones}
            elegida={Math.min(elegida, Math.max(0, direcciones.length - 1))} onElegir={setElegida} onFinalizar={finalizar} />
        </div>
      )}
    </main>
  )
}

export default CartPage
