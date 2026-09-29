import { Link } from 'react-router-dom'

const sinNavegar = (e) => e.preventDefault()

function Col({ titulo, children }) {
  return <div className="footer-col"><h3>{titulo}</h3>{children}</div>
}

// TODO: los links con href="#" se conectan cuando existan esas páginas
export default function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <Col titulo="Ayuda">
          <a href="#" onClick={sinNavegar}>Contáctanos</a>
          <a href="#" onClick={sinNavegar}>Preguntas frecuentes</a>
          <a href="#" onClick={sinNavegar}>Políticas de envío</a>
        </Col>
        <Col titulo="Explorar">
          <Link to="/libros">Categorías</Link>
          <a href="#" onClick={sinNavegar}>Sobre nosotros</a>
          <a href="#" onClick={sinNavegar}>Vender mis libros</a>
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
