import { logout as logoutThunk } from '../redux/userSlice'
import {useDispatch,useSelector} from 'react-redux'
import { Link } from 'react-router-dom'
import { useLibros } from '../hooks/useLibros'
import useEsAdmin from '../hooks/useEsAdmin'
import useIrAVender from '../hooks/useIrAVender'
import { AYUDA_LINKS, AYUDA_RAIZ } from '../data/ayuda'
import { NOSOTROS } from '../data/nosotros'

const ESTADOS = [['nuevos', 'Nuevos'], ['usados', 'Usados']]

// Panel del menú hamburguesa: mismas opciones que NavMenu, en acordeones
const MobileMenu = ({ abierto, onCerrar }) => {
  const librosRedux = useSelector((state) => state.libros.items)
  const loadingRedux = useSelector((state) => state.libros.loading)
  const errorRedux = useSelector((state) => state.libros.error)
  const categoriasRedux = useSelector((state) => state.libros.categorias.items)
  const { categorias } = useLibros({ libros: librosRedux, loading: loadingRedux, error: errorRedux, listaCategorias: categoriasRedux })
  const userRedux = useSelector((state) => state.user.user)
  const dispatch = useDispatch()
  const irAVender = useIrAVender({ dispatch, user: userRedux })
  const esAdmin = useEsAdmin()

  const logout=()=>dispatch(logoutThunk())

  if (!abierto) return null

  const vender = () => { onCerrar(); irAVender() }
  const salir = () => { onCerrar(); logout() }

  return (
    <>
      <div className="mmenu-back" onClick={onCerrar} />
      <nav id="menu-movil" className="mmenu" aria-label="Menú principal">
        {esAdmin && <Link to="/" className="mm-link" onClick={onCerrar}>Inicio</Link>}
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
        {esAdmin ? (
          <button className="mm-link" type="button" onClick={salir}>Cerrar sesión</button>
        ) : (
          <>
            <button className="mm-link" type="button" onClick={vender}>Vender</button>
            <Link to={NOSOTROS.to} className="mm-link" onClick={onCerrar}>{NOSOTROS.label}</Link>
            <details>
              <summary>Ayuda</summary>
              <div className="mm-body">
                <Link to={AYUDA_RAIZ} className="mm-link mm-all" onClick={onCerrar}>Centro de ayuda</Link>
                {AYUDA_LINKS.map(({ to, label }) => <Link key={to} to={to} className="mm-link" onClick={onCerrar}>{label}</Link>)}
              </div>
            </details>
          </>
        )}
      </nav>
    </>
  )
}

export default MobileMenu
