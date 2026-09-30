import { coverBg } from '../utils/colors'
import { fmt } from '../utils/format'
import { precioFinal } from '../services/vendedorService'
import { TONES } from '../utils/colors'

const ETIQUETAS = { EN_REVISION: 'EN REVISIÓN', RECHAZADO: 'RECHAZADO' }

const SellerBookRow = ({ libro, onEditar, onBaja, onAprobar }) => {
  const activo = libro.estado === 'activo'
  const aceptado = (libro.mod || 'ACEPTADO') === 'ACEPTADO'
  const color = TONES[(libro.t.length + libro.a.length) % TONES.length]

  return (
    <div className="card prow">
      <div className="cmini" style={{ background: coverBg({ c: color, imgs: libro.imgs }) }} />
      <div className="cinfo">
        <b>{libro.t}</b>
        <small>{libro.a} · {libro.cat} · {libro.usado ? 'Usado' : 'Nuevo'}</small>
        <small>Stock: {libro.stock}{libro.mod === 'RECHAZADO' && libro.modC ? ` · Motivo: ${libro.modC}` : ''}</small>
      </div>
      <div className="cprice">{fmt(precioFinal(libro))}</div>
      <span className={`tg${activo && aceptado ? '' : ' off'}`}>{!activo ? 'DE BAJA' : ETIQUETAS[libro.mod] || 'ACTIVO'}</span>
      <div className="ac">
        <button className="lnk" type="button" onClick={onEditar}>Editar</button>
        <button className="lnk" type="button" onClick={onBaja}>{activo ? 'Dar de baja' : 'Reactivar'}</button>
        {libro.mod === 'EN_REVISION' && <button className="lnk" type="button" onClick={onAprobar}>Simular aprobación (demo)</button>}
      </div>
    </div>
  )
}

export default SellerBookRow
