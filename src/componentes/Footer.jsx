import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import useIrAVender from '../hooks/useIrAVender'
import useEsAdmin from '../hooks/useEsAdmin'
import { AYUDA_LINKS } from '../data/ayuda'
import { NOSOTROS } from '../data/nosotros'
import { LEGALES_LINKS } from '../data/legales'
import LegalModal from './LegalModal'

const Col = ({ titulo, children }) => {
  return <div className="footer-col"><h3>{titulo}</h3>{children}</div>
}

// Con sesión lleva al perfil; sin sesión abre el modal de login y, al entrar, vuelve a /cuenta
const MiCuenta = () => {
  const { requiereLogin } = useAuth()
  const alClick = (e) => { if (requiereLogin('account', '/cuenta')) e.preventDefault() }
  return <Link to="/cuenta" onClick={alClick}>Mi cuenta</Link>
}

// Con sesión lleva a /vender; sin sesión abre el modal "¿Empezamos un nuevo capítulo?"
const VenderMisLibros = () => {
  const irAVender = useIrAVender()
  const alClick = (e) => { e.preventDefault(); irAVender() }
  return <Link to="/vender" onClick={alClick}>Vender mis libros</Link>
}

// Términos y Privacidad se leen en un pop-up, sin salir de la página en la que estás
const Footer = () => {
  const [legal, setLegal] = useState(null)
  const esAdmin = useEsAdmin()

  return (
    <>
      <footer>
        <div className="footer-main">
          {esAdmin ? (
            // Administrador: solo lo que puede usar (cambio de vista, inicio y catálogo)
            <>
              <Col titulo="Vistas">
                <Link to="/">Vista tienda</Link>
                <Link to="/admin">Vista gestión</Link>
              </Col>
              <Col titulo="Explorar">
                <Link to="/">Inicio</Link>
                <Link to="/libros">Catálogo</Link>
              </Col>
            </>
          ) : (
            <>
              <Col titulo="Ayuda">
                {AYUDA_LINKS.map(({ to, label }) => <Link key={to} to={to}>{label}</Link>)}
              </Col>
              <Col titulo="Explorar">
                <Link to="/libros">Categorías</Link>
                <Link to={NOSOTROS.to}>{NOSOTROS.label}</Link>
                <VenderMisLibros />
              </Col>
              <Col titulo="Mi Entrelibros">
                <MiCuenta />
              </Col>
            </>
          )}
          <div className="footer-brand">Entrelibros</div>
        </div>
        <div className="footer-legal">
          <span>© 2026 ENTRELIBROS.COM</span>
          <div className="legal-links">
            {LEGALES_LINKS.map((doc) => (
              <button key={doc.corto} type="button" onClick={() => setLegal(doc)}>{doc.corto}</button>
            ))}
          </div>
        </div>
      </footer>
    {legal && <LegalModal doc={legal} onCerrar={() => setLegal(null)} />}
    </>
  )
}

export default Footer
