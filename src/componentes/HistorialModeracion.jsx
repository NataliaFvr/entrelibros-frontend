import useHistorialModeracion from '../hooks/useHistorialModeracion'
import Aviso from './Aviso'
import EmptyBlock from './EmptyBlock'
import Pager from './Pager'

// Etiqueta y color de cada EstadoModeracion del back
const ESTADOS = {
  EN_REVISION: ['En revisión', ''],
  ACEPTADO: ['Aceptado', 'used'],
  RECHAZADO: ['Rechazado', 'off'],
}

const Estado = ({ valor }) => {
  const [texto, clase] = ESTADOS[valor] || [valor || '—', '']
  return <span className={`tg ${clase}`.trim()}>{texto}</span>
}

const fechaHora = (iso) => (iso ? new Date(iso).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' }) : '—')

// Historial de decisiones de moderación: todas, o las de un libro. `libro` { id, titulo } filtra; `onLibro(libro)` lo elige
// desde una fila y `onTodos()` quita el filtro. En celular y tablet cada fila es una tarjeta (mismas reglas que .adm-table).
const HistorialModeracion = ({ libro, onLibro, onTodos }) => {
  const h = useHistorialModeracion(libro)

  return (
    <section aria-label="Historial de moderación">
      {libro && (
        <div className="chips">
          <button className="chip" type="button" onClick={onTodos}>Libro: {libro.titulo} ✕</button>
          <button className="chip clear" type="button" onClick={onTodos}>Ver todo el historial</button>
        </div>
      )}
      {h.error && (
        <div className="mod-error">
          <Aviso mensaje={h.error} tipo="SERVIDOR" />
          <button className="lnk" type="button" onClick={h.reintentar}>Reintentar</button>
        </div>
      )}
      {h.cargando && <p className="sell-note" role="status">Cargando historial…</p>}
      {!h.cargando && !h.error && !h.registros.length && (
        <EmptyBlock titulo="Todavía no hay decisiones registradas"
          texto={libro ? 'Este libro todavía no tiene aprobaciones ni rechazos.' : 'Cuando apruebes o rechaces una publicación, queda registrado acá.'} />
      )}
      {!h.cargando && !h.error && h.registros.length > 0 && (
        <>
          <p className="hist-total">{h.total.toLocaleString('es-AR')} {h.total === 1 ? 'decisión registrada' : 'decisiones registradas'}</p>
          <div className="card adm-tw">
            <table className="adm-table">
              <thead>
                <tr><th>Fecha</th><th>Libro</th><th>Moderador</th><th>Cambio de estado</th><th>Comentario</th></tr>
              </thead>
              <tbody>
                {h.registros.map((r) => (
                  <tr key={r.id}>
                    <td data-label="Fecha">{fechaHora(r.fecha)}</td>
                    <td data-label="Libro" className="hist-libro">
                      {libro ? <b>{r.tituloLibro}</b>
                        : <button className="lnk" type="button" title="Ver solo el historial de este libro" onClick={() => onLibro({ id: r.idLibro, titulo: r.tituloLibro })}>{r.tituloLibro}</button>}
                    </td>
                    <td data-label="Moderador">{r.nombreModerador}</td>
                    <td data-label="Cambio de estado">
                      <span className="hist-cambio"><Estado valor={r.estadoAnterior} /><span aria-hidden="true">→</span><span className="adm-sr">a</span><Estado valor={r.estadoNuevo} /></span>
                    </td>
                    <td data-label="Comentario" className="hist-coment">{r.comentario || <small>Sin comentario</small>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pager page={h.pagina} pages={h.paginas} onChange={h.setPagina} />
        </>
      )}
    </section>
  )
}

export default HistorialModeracion
