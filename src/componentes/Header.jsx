import { Link } from 'react-router-dom'
import useMenuMovil from '../hooks/useMenuMovil'
import NavMenu from './NavMenu'
import SearchBox from './SearchBox'
import HeaderIcons from './HeaderIcons'
import BurgerButton from './BurgerButton'
import MobileMenu from './MobileMenu'

const Header = () => {
  const menu = useMenuMovil()

  return (
    <header>
      <div className="navbar">
        <Link to="/" className="logo-block">
          <span className="logo-mark" role="img" aria-label="Logo Entrelibros" />
          Entrelibros
        </Link>
        <div className="navbar-main">
          <NavMenu />
          <div className="navbar-right">
            <SearchBox />
            <HeaderIcons />
          </div>
        </div>
        <BurgerButton abierto={menu.abierto} onClick={menu.alternar} />
      </div>
      <MobileMenu abierto={menu.abierto} onCerrar={menu.cerrar} />
    </header>
  )
}

export default Header
