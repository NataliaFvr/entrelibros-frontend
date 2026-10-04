import { Link } from 'react-router-dom'
import Stars from './Stars'
import { fmt, plural } from '../utils/format'
import { esUsado } from '../utils/libro'

const BookmarkIcon = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h12v18l-6-4-6 4z" /></svg>
  )
}

// `rank` = posición en bestsellers; 0 significa que no participa (los usados nunca lo hacen)
const Etiquetas = ({ libro, rank }) => {
  const usado = esUsado(libro)
  const enRanking = !usado && rank > 0
  return (
    <div className="d-tags">
      <span className="d-state">{usado ? 'Usado' : 'Nuevo'}</span>
      {enRanking && rank <= 6 && <span className="tg">MÁS VENDIDO</span>}
      {libro.d > 0 && <span className="tg off">{libro.d}% OFF</span>}
      {enRanking && rank <= 10 && <span className="d-rank">Nº {rank} en Bestsellers</span>}
    </div>
  )
}

// `resumen` = { promedio, cantidad } de las opiniones. Sin `onGuardar` no se muestra el botón de Marcapáginas.
const BookInfo = ({ libro, rank, resumen, guardado, onGuardar }) => {
  const { promedio, cantidad } = resumen
  const usado = esUsado(libro) // un usado no muestra calificación del producto (opiniones solo de la obra)
  return (
    <div className="d-info">
      <div className="d-row">
        <Etiquetas libro={libro} rank={rank} />
        {onGuardar && (
          <button className={`fav${guardado ? ' on' : ''}`} type="button" aria-pressed={guardado} onClick={onGuardar}>
            <BookmarkIcon /><span>{guardado ? 'En mi Marcapáginas' : 'Guardar en Marcapáginas'}</span>
          </button>
        )}
      </div>
      <h1 className="d-title fr">{libro.t}</h1>
      <p className="d-author">de <Link to={`/libros?autor=${encodeURIComponent(libro.a)}`}>{libro.a}</Link></p>
      {!usado && (
        <a className="d-rate" href="#rev">
          <Stars value={promedio} /><span>{promedio.toFixed(1)}</span>
          <span className="dim">({cantidad} {plural(cantidad, 'opinión', 'opiniones')})</span>
        </a>
      )}
      <div className="d-price">
        <b>{fmt(libro.p)}</b>
        {libro.d > 0 && <><s>{fmt(libro.base)}</s><em>{libro.d}% OFF</em></>}
      </div>
      <div className="d-know">
        <h3>Lo que tenés que saber de este libro</h3>
        <ul>
          <li>Editorial: {libro.ed}</li><li>Idioma: {libro.idioma}</li>
          <li>Año de edición: {libro.anio}</li><li>Categoría: {libro.cat}</li>
        </ul>
        <a className="lnk" href="#spec">Ver características</a>
      </div>
    </div>
  )
}

export default BookInfo
