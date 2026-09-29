import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { CartIcon, UserIcon } from './Icons'
import Avatar from './Avatar'

// Con Enter o espacio también se activan (son div con role="button")
const alTeclear = (accion) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); accion() }
}

const HeaderIcons = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { user, cartCount, requiereLogin } = useAuth()

  const irACuenta = () => navigate(user ? '/cuenta' : '/ingresar')
  // TODO: pantalla del carrito
  const abrirCarrito = () => {
    if (requiereLogin('cart')) return
    toast('El carrito todavía no está disponible')
  }

  return (
    <>
      <div className="icon-btn" role="button" tabIndex={0} aria-label="Mi cuenta" onClick={irACuenta} onKeyDown={alTeclear(irACuenta)}>
        {user ? <Avatar user={user} size={30} /> : <UserIcon />}
      </div>
      <div className="icon-btn" role="button" tabIndex={0} aria-label="Carrito" onClick={abrirCarrito} onKeyDown={alTeclear(abrirCarrito)}>
        <CartIcon />
        <span className="cart-badge" hidden={cartCount === 0}>{cartCount > 99 ? '99+' : cartCount}</span>
      </div>
    </>
  )
}

export default HeaderIcons
