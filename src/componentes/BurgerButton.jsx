import { BooksMenuIcon, CloseIcon } from './Icons'

// Botón del menú móvil: tres libros cerrado, cruz abierto. Solo se ve en pantallas angostas (CSS).
const BurgerButton = ({ abierto, onClick }) => {
  return (
    <button
      className="burger" type="button" onClick={onClick}
      aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
      aria-expanded={abierto} aria-controls={abierto ? 'menu-movil' : undefined}
    >
      {abierto ? <CloseIcon /> : <BooksMenuIcon />}
    </button>
  )
}

export default BurgerButton
