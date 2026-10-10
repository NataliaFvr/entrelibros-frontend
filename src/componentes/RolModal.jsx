import { useState } from 'react'
import { ROLES } from '../data/admin'
import AdminModal from './AdminModal'
import Aviso from './Aviso'
import SelectField from './SelectField'
import Field from './Field'
import { PROVINCIAS } from '../data/provincias'

// Cambiar el rol de una cuenta. `onGuardar(rol)` devuelve { ok } o { error }.
const RolModal = ({ usuario, onGuardar, onCerrar }) => {
  const [rol, setRol] = useState(usuario.rol)
  const [provincia, setProvincia] = useState(usuario.provincia || 'Buenos Aires')
  const [telefono, setTelefono] = useState(usuario.telefono || '')
  const [error, setError] = useState('')

  const enviar = async (e) => {
    e.preventDefault()
    if (rol === 'VENDEDOR' && (!provincia.trim() || !telefono.trim())) {
      setError('Para habilitar a un vendedor, completá provincia y teléfono.')
      return
    }
    const r = await onGuardar(rol, rol === 'VENDEDOR' ? { provincia, telefono: telefono.trim() } : undefined) // con el back es async
    if (r.error) setError(r.error)
    else onCerrar()
  }

  return (
    <AdminModal titulo={`Cambiar rol de ${usuario.nombre}`} onCerrar={onCerrar}>
      <form className="aform" noValidate onSubmit={enviar}>
        <SelectField label="Rol" name="rol" value={rol} onChange={(_, valor) => setRol(valor)} opciones={ROLES} />
        {rol === 'VENDEDOR' && usuario.rol !== 'VENDEDOR' && (
          <>
            <p className="note">Para habilitar a un vendedor necesitás registrar su provincia y teléfono.</p>
            <div className="two">
              <SelectField label="Provincia" name="provincia" value={provincia} onChange={(_, valor) => setProvincia(valor)} opciones={PROVINCIAS} />
              <Field label="Teléfono" name="telefono" value={telefono} onChange={(_, valor) => setTelefono(valor)} type="tel" inputMode="tel" autoComplete="tel" />
            </div>
          </>
        )}
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
