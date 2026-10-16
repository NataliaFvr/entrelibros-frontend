import './ReviewControls.css'
// `onOpinar` es opcional: sin él no se muestra el botón (libros usados)
const ReviewControls = ({ orden, filtro, onOrden, onFiltro, onOpinar, puedeOpinar = true, motivo = '' }) => {
  return (
    <div className="rev-ctl">
      <select className="fsel" aria-label="Ordenar opiniones" value={orden} onChange={(e) => onOrden(e.target.value)}>
        <option value="new">Más recientes</option>
        <option value="hi">Mayor calificación</option>
        <option value="lo">Menor calificación</option>
      </select>
      <select className="fsel" aria-label="Filtrar por calificación" value={filtro} onChange={(e) => onFiltro(e.target.value)}>
        <option value="">Todas las calificaciones</option>
        {[5, 4, 3, 2, 1].map((k) => <option key={k} value={k}>{k} estrellas</option>)}
      </select>
      {onOpinar && (
        <button className="more" style={{ margin: 0 }} type="button" onClick={onOpinar} disabled={!puedeOpinar}
          title={puedeOpinar ? undefined : motivo} aria-describedby={puedeOpinar ? undefined : 'opinar-ayuda'}>
          Opinar sobre este libro
        </button>
      )}
      {onOpinar && !puedeOpinar && motivo && <small id="opinar-ayuda" className="dim" style={{ flexBasis: '100%' }}>{motivo}</small>}
    </div>
  )
}

export default ReviewControls
