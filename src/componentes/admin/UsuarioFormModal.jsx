import useFormulario from '../../hooks/useFormulario'
import { ROLES_CREABLES } from '../../data/admin'
import { PROVINCIAS } from '../../data/provincias'
import AdminModal from './AdminModal'
import Aviso from '../comun/Aviso'
import Field from '../comun/Field'
import PasswordField from '../auth/PasswordField'
import SelectField from '../comun/SelectField'

// Inputs del formulario: un error del back con otro nombre (o sin campo) se muestra en el aviso general
const CAMPOS = ['nombre', 'apellido', 'nombreUsuario', 'email', 'contrasena', 'nombreTienda', 'provincia', 'telefono']

// Crear (sin `usuario`) o editar (con `usuario`). `onGuardar(valores)` devuelve { ok } o { error, campos }.
// Al crear un VENDEDOR se piden además la tienda, la provincia y el teléfono (el back los exige, igual que al cambiar el rol).
const UsuarioFormModal = ({ usuario, onGuardar, onCerrar }) => {
  const editando = Boolean(usuario)
  const f = useFormulario({
    nombre: usuario?.nombre ?? '', apellido: usuario?.apellido ?? '', nombreUsuario: usuario?.nombreUsuario ?? '',
    email: usuario?.email ?? '', contrasena: '', rol: 'COMPRADOR',
    nombreTienda: '', provincia: 'Buenos Aires', telefono: '',
  })
  const esVendedor = !editando && f.valores.rol === 'VENDEDOR'

  const enviar = async (e) => {
    e.preventDefault()
    const r = await onGuardar(f.valores) // con el back es async
    if (!r.error) return onCerrar()
    const campos = r.campos || {}
    const enInputs = Object.fromEntries(Object.entries(campos).filter(([k]) => CAMPOS.includes(k)))
    f.setErroresCampos(enInputs)
    // Si el error no corresponde a ningún input (ej. e-mail ya registrado), va al aviso general
    if (!Object.keys(enInputs).length) f.setError(r.error, 'DUPLICADO')
    else f.setError('')
  }

  const campo = (nombre) => ({ name: nombre, value: f.valores[nombre], onChange: f.cambiar, error: f.errores[nombre] })

  return (
    <AdminModal titulo={editando ? `Editar a ${usuario.nombre}` : 'Crear usuario'} onCerrar={onCerrar}>
      <form className="aform" noValidate onSubmit={enviar}>
        <div className="two">
          <Field label="Nombre" autoComplete="off" {...campo('nombre')} />
          <Field label="Apellido" autoComplete="off" {...campo('apellido')} />
        </div>
        <Field label="Nombre de usuario" autoComplete="off" {...campo('nombreUsuario')} />
        <Field label="E-mail" type="email" autoComplete="off" {...campo('email')} />
        <PasswordField label={editando ? 'Nueva contraseña (vacía = no cambia)' : 'Contraseña (mín. 8, mayúscula, número y símbolo)'} autoComplete="new-password" {...campo('contrasena')} />
        {!editando && <SelectField label="Rol" opciones={ROLES_CREABLES} {...campo('rol')} />}
        {esVendedor && (
          <>
            <p className="note">Para crear un vendedor necesitás registrar su tienda, provincia y teléfono.</p>
            <Field label="Nombre de la tienda" autoComplete="organization" {...campo('nombreTienda')} />
            <div className="two">
              <SelectField label="Provincia" opciones={PROVINCIAS} {...campo('provincia')} />
              <Field label="Teléfono" type="tel" inputMode="tel" autoComplete="tel" {...campo('telefono')} />
            </div>
          </>
        )}
        <Aviso mensaje={f.error} tipo={f.tipoError} />
        <div className="modal-btns">
          <button className="btn main" type="submit">{editando ? 'Guardar cambios' : 'Crear usuario'}</button>
          <button className="btn alt" type="button" onClick={onCerrar}>Cancelar</button>
        </div>
      </form>
    </AdminModal>
  )
}

export default UsuarioFormModal