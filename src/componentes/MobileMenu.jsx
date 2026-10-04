import { Link } from 'react-router-dom'
import { useLibros } from '../hooks/useLibros'
import useIrAVender from '../hooks/useIrAVender'
import { AYUDA_LINKS, AYUDA_RAIZ } from '../data/ayuda'
import { NOSOTROS } from '../data/nosotros'

const ESTADOS = [['nuevos', 'Nuevos'], ['usados', 'Usados']]

// Panel del menú hamburguesa: mismas opciones que NavMenu, en acordeones
const MobileMenu = ({ abierto, onCerrar }) => {
  const { categorias } = useLibros()
  const irAVender = useIrAVender()

  if (!abierto) return null

  const vender = () => { onCerrar(); irAVender() }

  return (
    <>
      <div className="mmenu-back" onClick={onCerrar} />
      <nav id="menu-movil" className="mmenu" aria-label="Menú principal">
        <details open>
          <summary>Libros</summary>
          <div className="mm-body">
            <Link to="/libros" className="mm-link mm-all" onClick={onCerrar}>Ver todo el catálogo</Link>
            {ESTADOS.map(([estado, etiqueta]) => (
              <details key={estado} className="mm-sub">
                <summary>{etiqueta}</summary>
                <div className="mm-body">
                  {categorias.map((c) => (
                    <Link key={c} className="mm-link" to={`/libros?estado=${estado}&cat=${encodeURIComponent(c)}`} onClick={onCerrar}>{c}</Link>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </details>
        <button className="mm-link" type="button" onClick={vender}>Vender</button>
        <Link to={NOSOTROS.to} className="mm-link" onClick={onCerrar}>{NOSOTROS.label}</Link>
        <details>
          <summary>Ayuda</summary>
          <div className="mm-body">
            <Link to={AYUDA_RAIZ} className="mm-link mm-all" onClick={onCerrar}>Centro de ayuda</Link>
            {AYUDA_LINKS.map(({ to, label }) => <Link key={to} to={to} className="mm-link" onClick={onCerrar}>{label}</Link>)}
          </div>
        </details>
      </nav>
    </>
  )
}

export default MobileMenu
