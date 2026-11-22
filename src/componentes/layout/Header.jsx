import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import useMenuMovil from '../../hooks/useMenuMovil'
import NavMenu from './NavMenu'
import SearchBox from '../catalogo/SearchBox'
import HeaderIcons from './HeaderIcons'
import HeaderAdmin from '../admin/HeaderAdmin'
import BurgerButton from './BurgerButton'
import MobileMenu from './MobileMenu'

const Header = () => {
  const menu = useMenuMovil()
  const esAdmin = useSelector((state) => state.user.user?.rol === 'ADMIN')

  return (
    <header onKeyDown={menu.alTeclear}>
      <div className="navbar">
        <Link to="/" className="logo-block">
          <span className="logo-mark" role="img" aria-label="Logo Entrelibros" />
          Entrelibros
        </Link>
        <div className="navbar-main">
          <NavMenu />
          <div className="navbar-right">
            <SearchBox />
            {esAdmin ? <HeaderAdmin /> : <HeaderIcons />}
          </div>
        </div>
        <BurgerButton abierto={menu.abierto} onClick={menu.alternar} />
      </div>
      <MobileMenu abierto={menu.abierto} onCerrar={menu.cerrar} />
    </header>
  )
}

export default Header
