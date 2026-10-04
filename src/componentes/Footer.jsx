import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AYUDA_LINKS } from '../data/ayuda'
import { LEGALES_LINKS } from '../data/legales'

const sinNavegar = (e) => e.preventDefault()

const Col = ({ titulo, children }) => {
  return <div className="footer-col"><h3>{titulo}</h3>{children}</div>
}

// Con sesión lleva al perfil; sin sesión abre el modal de login y, al entrar, vuelve a /cuenta
const MiCuenta = () => {
  const { requiereLogin } = useAuth()
  const alClick = (e) => { if (requiereLogin('account', '/cuenta')) e.preventDefault() }
  return <Link to="/cuenta" onClick={alClick}>Mi cuenta</Link>
}

// TODO: "Sobre nosotros" sigue con href="#" hasta que exista esa página
const Footer = () => {
  return (
    <footer>
      <div className="footer-main">
        <Col titulo="Ayuda">
          {AYUDA_LINKS.map(({ to, label }) => <Link key={to} to={to}>{label}</Link>)}
        </Col>
        <Col titulo="Explorar">
          <Link to="/libros">Categorías</Link>
          <a href="#" onClick={sinNavegar}>Sobre nosotros</a>
          <Link to="/vender">Vender mis libros</Link>
        </Col>
        <Col titulo="Mi Entrelibros">
          <MiCuenta />
        </Col>
        <div className="footer-brand">Entrelibros</div>
      </div>
      <div className="footer-legal">
        <span>© 2026 ENTRELIBROS.COM</span>
        <div className="legal-links">
          {LEGALES_LINKS.map(({ to, corto }) => <Link key={to} to={to}>{corto}</Link>)}
        </div>
      </div>
    </footer>
  )
}

export default Footer
