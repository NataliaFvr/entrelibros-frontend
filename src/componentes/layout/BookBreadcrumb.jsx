import { Link, useLocation, useNavigate } from 'react-router-dom'

const BookBreadcrumb = ({ libro }) => {
  const navigate = useNavigate()
  const { key } = useLocation()
  // "default" = se entró directo al libro, no hay listado al que volver
  const volver = () => (key === 'default' ? navigate('/libros') : navigate(-1))

  return (
    <div className="det-top">
      <div className="crumbs">
        <Link to="/">Inicio</Link> › <Link to="/libros">Libros</Link> ›{' '}
        <Link to={`/libros?cat=${encodeURIComponent(libro.cat)}`}>{libro.cat}</Link> › <span>{libro.t}</span>
      </div>
      <button className="det-back" type="button" onClick={volver}>← Volver al listado</button>
    </div>
  )
}

export default BookBreadcrumb
