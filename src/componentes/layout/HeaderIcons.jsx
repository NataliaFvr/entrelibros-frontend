import { CartIcon, UserIcon } from './Icons'

// TODO: conectar con auth (Mi cuenta) y con el carrito cuando existan esas pantallas
export default function HeaderIcons({ cartCount = 0 }) {
  return (
    <>
      <UserIcon className="icon-btn" role="button" tabIndex={0} aria-label="Mi cuenta" />
      <div className="icon-btn" role="button" tabIndex={0} aria-label="Carrito">
        <CartIcon />
        <span className="cart-badge" hidden={cartCount === 0}>{cartCount > 99 ? '99+' : cartCount}</span>
      </div>
    </>
  )
}
