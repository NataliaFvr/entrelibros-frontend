import ComparadorCambios from './ComparadorCambios'

const ETIQUETA = { NUEVO: 'Nueva publicación', MODIFICACION: 'Modificación' }

// Una solicitud de la cola: título, vendedor, comparador y acciones Aprobar / Rechazar.
const ModeracionItem = ({ solicitud, ocupado, onAprobar, onRechazar }) => {
  const { id, tipoModeracion, nombreVendedor, fechaSolicitud, datosActuales, datosPropuestos } = solicitud
  return (
    <article className="card mod-item" aria-busy={ocupado}>
      <div className="mod-head">
        <div className="mod-tit">
          <b>{datosPropuestos.titulo}</b>
          <small>
            {nombreVendedor ? `Vendedor: ${nombreVendedor}` : `Libro #${id}`}
            {fechaSolicitud && ` · ${new Date(fechaSolicitud).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })}`}
          </small>
        </div>
        <span className="tg rev">{ETIQUETA[tipoModeracion]}</span>
      </div>
      <ComparadorCambios actuales={datosActuales} propuestos={datosPropuestos} />
      <div className="mod-actions">
        <button className="btn main" type="button" disabled={ocupado} onClick={onAprobar}>{ocupado ? 'Procesando…' : 'Aprobar'}</button>
        <button className="btn alt" type="button" disabled={ocupado} onClick={onRechazar}>Rechazar</button>
      </div>
    </article>
  )
}

export default ModeracionItem
