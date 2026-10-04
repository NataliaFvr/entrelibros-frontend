import { Link } from 'react-router-dom'
import { AYUDA_LINKS } from '../data/ayuda'

const sinNavegar = (e) => e.preventDefault()

const Col = ({ titulo, children }) => {
  return <div className="footer-col"><h3>{titulo}</h3>{children}</div>
}

// TODO: los links con href="#" se conectan cuando existan esas páginas
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
          <a href="#" onClick={sinNavegar}>Mi cuenta</a>
        </Col>
        <div className="footer-brand">Entrelibros</div>
      </div>
      <div className="footer-legal">
        <span>© 2026 ENTRELIBROS.COM</span>
        <div className="legal-links">
          <a href="#" onClick={sinNavegar}>Términos</a>
          <a href="#" onClick={sinNavegar}>Privacidad</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
