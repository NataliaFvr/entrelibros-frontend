/* oxlint-disable no-unused-vars */
import { abrirGate,cerrarGate as cerrarGateAction,cancelarVerificacion,confirmarEmail,crearDireccion,eliminarDireccion as eliminarDireccionThunk,fetchUsuario,guardarPerfil,limpiarPendiente as limpiarPendienteAction,login as loginThunk,logout as logoutThunk,marcarPrincipal as marcarPrincipalThunk,NOTA_SIN_CONFIRMAR,quitarMarks as quitarMarksThunk,reenviarCodigo,registrar as registrarThunk,toggleMark as toggleMarkThunk } from '../redux/authSlice'
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
  const { categorias } = useLibros()
  const irAVender = useIrAVender()
  const esAdmin = useEsAdmin()
  const dispatch=useDispatch()

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
