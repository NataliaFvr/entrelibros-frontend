import { useState } from 'react'
import { ROLES } from '../data/admin'
import AdminModal from './AdminModal'
import Aviso from './Aviso'
import SelectField from './SelectField'

// Cambiar el rol de una cuenta. `onGuardar(rol)` devuelve { ok } o { error }.
const RolModal = ({ usuario, onGuardar, onCerrar }) => {
  const [rol, setRol] = useState(usuario.rol)
  const [error, setError] = useState('')

  const enviar = async (e) => {
    e.preventDefault()
    const r = await onGuardar(rol) // con el back es async
    if (r.error) setError(r.error)
    else onCerrar()
  }

  return (
    <AdminModal titulo={`Cambiar rol de ${usuario.nombre}`} onCerrar={onCerrar}>
      <form className="aform" noValidate onSubmit={enviar}>
        <SelectField label="Rol" name="rol" value={rol} onChange={(_, valor) => setRol(valor)} opciones={ROLES} />
        <p className="note">Pasar a Vendedor le permite publicar libros; los libros ya publicados no cambian.</p>
        <Aviso mensaje={error} tipo="DESCONOCIDO" />
        <div className="modal-btns">
          <button className="btn main" type="submit">Guardar rol</button>
          <button className="btn alt" type="button" onClick={onCerrar}>Cancelar</button>
        </div>
      </form>
    </AdminModal>
  )
}

export default RolModal
