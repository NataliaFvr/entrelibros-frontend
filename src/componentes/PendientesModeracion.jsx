import Aviso from './Aviso'

// Primeras publicaciones en la cola de moderación, con acceso directo a revisarlas.
const PendientesModeracion = ({ pendientes, cargando, error, onRevisar, max = 4 }) => {
  return (
    <div className="card">
      <h3 className="fr adm-card-t">Pendientes de moderación</h3>
      {error && <Aviso mensaje={error} tipo="SERVIDOR" />}
      {cargando && <p className="note" role="status">Cargando solicitudes…</p>}
      {!cargando && !error && !pendientes.length && <p className="note">No hay libros esperando revisión.</p>}
      {pendientes.slice(0, max).map((s) => (
        <div className="sl adm-pend" key={s.id}>
          <span>
            <b>{s.datosPropuestos.titulo}</b>
            <small>{s.nombreVendedor || `Libro #${s.id}`}</small>
          </span>
          <button className="btn alt adm-sm" type="button" onClick={onRevisar}>Revisar</button>
        </div>
      ))}
    </div>
  )
}

export default PendientesModeracion
