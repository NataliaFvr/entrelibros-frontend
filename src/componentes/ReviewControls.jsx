import './ReviewControls.css'
import { plural } from '../utils/format'
// `onOpinar` es opcional: sin él no se muestra el botón (libros usados)
// `yaOpino`: la persona ya tiene una opinión de este libro -> el botón la edita
const ReviewControls = ({ orden, filtro, onOrden, onFiltro, onOpinar, puedeOpinar = true, motivo = '', yaOpino = false }) => {
  const habilitado = puedeOpinar || yaOpino
  return (
    <div className="rev-ctl">
      <select className="fsel" aria-label="Ordenar opiniones" value={orden} onChange={(e) => onOrden(e.target.value)}>
        <option value="new">Más recientes</option>
        <option value="hi">Mayor calificación</option>
        <option value="lo">Menor calificación</option>
      </select>
      <select className="fsel" aria-label="Filtrar por calificación" value={filtro} onChange={(e) => onFiltro(e.target.value)}>
        <option value="">Todas las calificaciones</option>
        {[5, 4, 3, 2, 1].map((k) => <option key={k} value={k}>{k} {plural(k, 'estrella', 'estrellas')}</option>)}
      </select>
      {onOpinar && (
        <button className="more" style={{ margin: 0 }} type="button" onClick={onOpinar} disabled={!habilitado}
          title={habilitado ? undefined : motivo} aria-describedby={habilitado ? undefined : 'opinar-ayuda'}>
          {yaOpino ? 'Editar mi opinión' : 'Opinar sobre este libro'}
        </button>
      )}
      {onOpinar && !habilitado && motivo && <small id="opinar-ayuda" className="dim" style={{ flexBasis: '100%' }}>{motivo}</small>}
    </div>
  )
}

export default ReviewControls
