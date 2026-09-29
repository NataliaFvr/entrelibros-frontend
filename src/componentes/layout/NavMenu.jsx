import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLibros } from '../../hooks/useLibros'
import { ChevronDown } from './Icons'

const sinNavegar = (e) => e.preventDefault()

function SubItem({ estado, etiqueta, categorias }) {
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

function MenuLibros({ activo }) {
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

function MenuAyuda() {
  return (
    <div className="nav-item">
      Ayuda <ChevronDown />
      <div className="dropdown">
        {/* TODO: rutas de las páginas de ayuda */}
        <a href="#" onClick={sinNavegar}>Contáctanos</a>
        <a href="#" onClick={sinNavegar}>Preguntas frecuentes</a>
        <a href="#" onClick={sinNavegar}>Políticas de envío</a>
      </div>
    </div>
  )
}

export default function NavMenu() {
  const { pathname } = useLocation()
  const enLibros = pathname.startsWith('/libro')

  return (
    <nav>
      <MenuLibros activo={enLibros} />
      <div className="nav-item">Vender</div>
      <div className="nav-item">Sobre nosotros</div>
      <MenuAyuda />
    </nav>
  )
}
