import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLibros } from '../hooks/useLibros'
import { useAuth } from '../hooks/useAuth'
import { AYUDA_LINKS, AYUDA_RAIZ } from '../data/ayuda'
import { ChevronDown } from './Icons'

const SubItem = ({ estado, etiqueta, categorias }) => {
  return (
    <div className="sub-item">
      {etiqueta} <span>›</span>
      <div className="sub-menu">
        {categorias.map((c) => (
          <Link key={c} to={`/libros?estado=${estado}&cat=${encodeURIComponent(c)}`}>{c}</Link>
        ))}
      </div>
    </div>
  )
}

const MenuLibros = ({ activo }) => {
  const navigate = useNavigate()
  const { categorias } = useLibros()
  // Click en "Libros" abre el catálogo; los links del desplegable navegan por su cuenta
  const abrir = (e) => { if (!e.target.closest('.dropdown')) navigate('/libros') }

  return (
    <div className={`nav-item${activo ? ' on' : ''}`} onClick={abrir}>
      Libros <ChevronDown />
      <div className="dropdown">
        <SubItem estado="nuevos" etiqueta="Nuevos" categorias={categorias} />
        <SubItem estado="usados" etiqueta="Usados" categorias={categorias} />
      </div>
    </div>
  )
}

const MenuAyuda = ({ activo }) => {
  const navigate = useNavigate()
  // Click en "Ayuda" abre el Centro de ayuda; los links del desplegable navegan por su cuenta
  const abrir = (e) => { if (!e.target.closest('.dropdown')) navigate(AYUDA_RAIZ) }

  return (
    <div className={`nav-item${activo ? ' on' : ''}`} onClick={abrir}>
      Ayuda <ChevronDown />
      <div className="dropdown">
        {AYUDA_LINKS.map(({ to, label }) => <Link key={to} to={to}>{label}</Link>)}
      </div>
    </div>
  )
}

const NavMenu = () => {
  const { pathname } = useLocation()
  const enLibros = pathname.startsWith('/libro')
  const enAyuda = pathname.startsWith(AYUDA_RAIZ)
  const navigate = useNavigate()
  const { requiereLogin } = useAuth()
  const vender = () => {
    if (!requiereLogin('sell')) navigate('/vender')
  }

  return (
    <nav>
      <MenuLibros activo={enLibros} />
      <div className="nav-item" onClick={vender}>Vender</div>
      <div className="nav-item">Sobre nosotros</div>
      <MenuAyuda activo={enAyuda} />
    </nav>
  )
}

export default NavMenu
