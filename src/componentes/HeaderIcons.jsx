import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCompra } from '../hooks/useCompra'
import { ShelfIcon, UserIcon } from './Icons'
import Avatar from './Avatar'

// Con Enter o espacio también se activan (son div con role="button")
const alTeclear = (accion) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); accion() }
}

const HeaderIcons = () => {
  const navigate = useNavigate()
  const { user, perfil, requiereLogin } = useAuth()
  const { cartCount } = useCompra()

  const irACuenta = () => navigate(user ? '/cuenta' : '/ingresar')
  const abrirEstanteria = () => {
    if (requiereLogin('cart')) return
    navigate('/carrito')
  }

  return (
    <>
      <div className="icon-btn" role="button" tabIndex={0} aria-label="Mi cuenta" onClick={irACuenta} onKeyDown={alTeclear(irACuenta)}>
        {user ? <Avatar user={user} perfil={perfil} size={30} /> : <UserIcon />}
      </div>
      <div className="icon-btn" role="button" tabIndex={0} aria-label="Mi estantería" title="Mi estantería" onClick={abrirEstanteria} onKeyDown={alTeclear(abrirEstanteria)}>
        <ShelfIcon />
        <span className="cart-badge" hidden={cartCount === 0}>{cartCount > 99 ? '99+' : cartCount}</span>
      </div>
    </>
  )
}

export default HeaderIcons
