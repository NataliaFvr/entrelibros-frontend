import { MenuIcon, CloseIcon } from './Icons'

// Botón del menú móvil: tres líneas (hamburguesa) cerrado, cruz abierto, en el celeste de la marca. Solo se ve en pantallas angostas (CSS).
const BurgerButton = ({ abierto, onClick }) => {
  return (
    <button
      className="burger" type="button" onClick={onClick}
      aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
      aria-expanded={abierto} aria-controls={abierto ? 'menu-movil' : undefined}
    >
      {abierto ? <CloseIcon /> : <MenuIcon />}
    </button>
  )
}

export default BurgerButton
