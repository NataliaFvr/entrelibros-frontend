import { Link } from 'react-router-dom'
import { plural } from '../utils/format'
import Stars from './Stars'
import './SellerPanel.css'

// Widget del dashboard: promedio global de reputación + acceso a "Mis calificaciones"
const SellerRatingWidget = ({ calificaciones }) => {
  const { global, atencion, libros } = calificaciones
  return (
    <div className="card rating-w">
      {global.cantidad ? (
        <>
          <div className="rw-score">
            <b className="fr">{global.promedio.toFixed(1)}</b>
            <Stars value={global.promedio} />
          </div>
          <div className="rw-txt">
            <b>Reputación global</b>
            <small>
              {global.cantidad} {plural(global.cantidad, 'calificación', 'calificaciones')}
              {' · '}atención {atencion.resenias.length ? atencion.promedio.toFixed(1) : '—'} ({atencion.resenias.length})
              {' · '}libros {libros.resenias.length ? libros.promedio.toFixed(1) : '—'} ({libros.resenias.length})
            </small>
          </div>
        </>
      ) : (
        <div className="rw-txt"><b>Reputación global</b><small>Todavía no recibiste calificaciones.</small></div>
      )}
      <Link className="btn alt" to="/vender/reputacion">Mis calificaciones</Link>
    </div>
  )
}

export default SellerRatingWidget
