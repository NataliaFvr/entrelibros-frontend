import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLibros } from '../hooks/useLibros'
import useEsAdmin from '../hooks/useEsAdmin'
import useMenuDesplegable from '../hooks/useMenuDesplegable'
import useIrAVender from '../hooks/useIrAVender'
import { AYUDA_LINKS, AYUDA_RAIZ } from '../data/ayuda'
import { NOSOTROS } from '../data/nosotros'
import { ChevronDown } from './Icons'

// Submenú de "Nuevos" / "Usados": con mouse se abre al pasar; con el dedo o el teclado, con el botón.
// Solo uno abierto a la vez (`abierto` lo decide MenuLibros).
const SubItem = ({ estado, etiqueta, categorias, abierto, onAlternar, onElegir }) => (
  <div className={`sub-item${abierto ? ' open' : ''}`}>
    <button className="sub-btn" type="button" aria-haspopup="true" aria-expanded={abierto} onClick={onAlternar}>
      {etiqueta} <span aria-hidden="true">›</span>
    </button>
    <div className="sub-menu">
      {categorias.map((c) => (
        <Link key={c} to={`/libros?estado=${estado}&cat=${encodeURIComponent(c)}`} onClick={onElegir}>{c}</Link>
      ))}
    </div>
  </div>
)

// Ítem de la barra con desplegable: el texto es un enlace (navega a `to`) y la flecha abre el panel.
// El estado vive en useMenuDesplegable (hover del mouse, botón táctil/teclado, Escape, toque afuera y cambio de ruta).
const NavDesplegable = ({ etiqueta, to, activo, children }) => {
  const menu = useMenuDesplegable()
  return (
    <div className={`nav-item has-dd${activo ? ' on' : ''}${menu.abierto ? ' open' : ''}`} {...menu.props}>
      <Link to={to} className="nav-link" onClick={menu.cerrar}>{etiqueta}</Link>
      <button className="nav-caret" type="button" aria-haspopup="true" aria-expanded={menu.abierto}
        aria-label={`${menu.abierto ? 'Ocultar' : 'Mostrar'} el menú de ${etiqueta}`} onClick={menu.alternar}>
        <ChevronDown />
      </button>
      <div className="dropdown">{children(menu.cerrar, menu.abierto)}</div>
    </div>
  )
}

// Contenido del desplegable de Libros. Se vuelve a montar (key) cada vez que el menú se abre o cierra,
// así nunca queda un submenú abierto de la vez anterior.
const SubMenusLibros = ({ onElegir }) => {
  const { categorias } = useLibros()
  const [sub, setSub] = useState(null)
  return ['nuevos', 'usados'].map((estado) => (
    <SubItem key={estado} estado={estado} etiqueta={estado === 'nuevos' ? 'Nuevos' : 'Usados'} categorias={categorias}
      abierto={sub === estado} onAlternar={() => setSub((s) => (s === estado ? null : estado))} onElegir={onElegir} />
  ))
}

const MenuLibros = ({ activo }) => (
  <NavDesplegable etiqueta="Libros" to="/libros" activo={activo}>
    {(cerrar, abierto) => <SubMenusLibros key={String(abierto)} onElegir={cerrar} />}
  </NavDesplegable>
)

const MenuAyuda = ({ activo }) => (
  <NavDesplegable etiqueta="Ayuda" to={AYUDA_RAIZ} activo={activo}>
    {(cerrar) => AYUDA_LINKS.map(({ to, label }) => <Link key={to} to={to} onClick={cerrar}>{label}</Link>)}
  </NavDesplegable>
)

const NavMenu = () => {
  const { pathname } = useLocation()
  const enLibros = pathname.startsWith('/libro')
  const enAyuda = pathname.startsWith(AYUDA_RAIZ)
  const enNosotros = pathname === NOSOTROS.to
  const vender = useIrAVender()
  const esAdmin = useEsAdmin()

  // El administrador solo ve inicio y catálogo
  if (esAdmin) {
    return (
      <nav>
        <Link className={`nav-item${pathname === '/' ? ' on' : ''}`} to="/">Inicio</Link>
        <MenuLibros activo={enLibros} />
      </nav>
    )
  }

  return (
    <nav>
      <MenuLibros activo={enLibros} />
      <div className="nav-item" onClick={vender}>Vender</div>
      <Link className={`nav-item${enNosotros ? ' on' : ''}`} to={NOSOTROS.to}>{NOSOTROS.label}</Link>
      <MenuAyuda activo={enAyuda} />
    </nav>
  )
}

export default NavMenu
