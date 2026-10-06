import { useState } from 'react'
import AdminModal from './AdminModal'
import Aviso from './Aviso'

// Confirmación antes de dar de baja una cuenta. `onConfirmar()` devuelve { ok } o { error }.
const ConfirmarBajaModal = ({ usuario, onConfirmar, onCerrar }) => {
  const [error, setError] = useState('')

  const confirmar = async () => {
    const r = await onConfirmar() // con el back es async
    if (r.error) setError(r.error)
    else onCerrar()
  }

  return (
    <AdminModal titulo={`¿Dar de baja a ${usuario.nombre} ${usuario.apellido}?`} onCerrar={onCerrar}>
      <p className="note">
        {usuario.rol === 'VENDEDOR' && 'Es vendedor: sus libros dejan de mostrarse en el catálogo. '}
        No podrá iniciar sesión hasta que lo reactives.
      </p>
      <Aviso mensaje={error} tipo="DESCONOCIDO" />
      <div className="modal-btns">
        <button className="btn main" type="button" onClick={confirmar}>Dar de baja</button>
        <button className="btn alt" type="button" onClick={onCerrar}>Cancelar</button>
      </div>
    </AdminModal>
  )
}

export default ConfirmarBajaModal
