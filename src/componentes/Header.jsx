import { Link } from 'react-router-dom'
import NavMenu from './NavMenu'
import SearchBox from './SearchBox'
import HeaderIcons from './HeaderIcons'

const Header = () => {
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
      </div>
    </header>
  )
}

export default Header
