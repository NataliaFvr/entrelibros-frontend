import { coverBg, TONES } from '../utils/colors'
import { fmt } from '../utils/format'
import { enRevision, precioFinal } from '../services/vendedorService'
import { USAR_API } from '../utils/modoApi'
import './SellerPanel.css'

const ETIQUETAS = { EN_REVISION: 'EN REVISIÓN', RECHAZADO: 'RECHAZADO' }

// Fila de "Mis libros". Con una revisión pendiente el libro sale del catálogo, se marca "Modificación en revisión"
// y no se puede volver a editar hasta que el administrador responda.
const SellerBookRow = ({ libro, onEditar, onBaja, onAprobar, onRechazar }) => {
  const activo = libro.estado === 'activo'
  const aceptado = (libro.mod || 'ACEPTADO') === 'ACEPTADO'
  const pendiente = enRevision(libro)
  const modificacion = Boolean(libro.revision)
  const color = TONES[(libro.t.length + libro.a.length) % TONES.length]

  return (
    <div className="card prow">
      <div className="cmini" style={{ background: coverBg({ c: color, imgs: libro.imgs }) }} />
      <div className="cinfo">
        <b>{libro.t}</b>
        <small>{libro.a} · {libro.cat} · {libro.usado ? 'Usado' : 'Nuevo'}</small>
        <small>Stock: {libro.stock}{libro.mod === 'RECHAZADO' && libro.modC ? ` · Motivo: ${libro.modC}` : ''}</small>
        {modificacion && (
          <>
            <span className="tg rev" role="status">Modificación en revisión</span>
            <small className="rev-note" id={`rev-${libro.id}`}>Mientras tanto el libro no se muestra en el catálogo.</small>
          </>
        )}
        {!pendiente && aceptado && libro.modC && <small className="rev-note">Tu última modificación fue rechazada: {libro.modC}</small>}
      </div>
      <div className="cprice">{fmt(precioFinal(libro))}</div>
      <span className={`tg${activo && aceptado && !modificacion ? '' : ' off'}`}>{!activo ? 'DE BAJA' : modificacion ? ETIQUETAS.EN_REVISION : ETIQUETAS[libro.mod] || 'ACTIVO'}</span>
      <div className="ac">
        <button className="lnk" type="button" onClick={onEditar} disabled={pendiente}
          aria-describedby={modificacion ? `rev-${libro.id}` : undefined}
          title={pendiente ? 'Tenés una revisión pendiente: podés volver a editar cuando un administrador la resuelva' : undefined}>
          {pendiente ? 'Editar nuevamente' : 'Editar'}
        </button>
        <button className="lnk" type="button" onClick={onBaja}>{activo ? 'Dar de baja' : 'Reactivar'}</button>
        {pendiente && !USAR_API && <button className="lnk" type="button" onClick={onAprobar}>Simular aprobación (demo)</button>}
        {pendiente && !USAR_API && <button className="lnk" type="button" onClick={onRechazar}>Simular rechazo (demo)</button>}
      </div>
    </div>
  )
}

export default SellerBookRow
