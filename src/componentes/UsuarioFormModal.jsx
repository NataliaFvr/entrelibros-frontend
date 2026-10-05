import useFormulario from '../hooks/useFormulario'
import { ROLES } from '../data/admin'
import { validarEmail, validarPasswordNueva, validarUsuario } from '../utils/validaciones'
import AdminModal from './AdminModal'
import Aviso from './Aviso'
import Field from './Field'
import PasswordField from './PasswordField'
import SelectField from './SelectField'

const obligatorio = (mensaje) => (v) => (String(v ?? '').trim() ? '' : mensaje)

// Al editar, la contraseña vacía significa "no cambia"
const validadores = (editando) => ({
  nombre: obligatorio('Ingresá el nombre.'),
  apellido: obligatorio('Ingresá el apellido.'),
  nombreUsuario: validarUsuario,
  email: validarEmail,
  pw: (v) => (editando && !v ? '' : validarPasswordNueva(v)),
})

// Crear (sin `usuario`) o editar (con `usuario`). `onGuardar(valores)` devuelve { ok } o { error }.
const UsuarioFormModal = ({ usuario, onGuardar, onCerrar }) => {
  const editando = Boolean(usuario)
  const f = useFormulario(
    { nombre: usuario?.nombre ?? '', apellido: usuario?.apellido ?? '', nombreUsuario: usuario?.nombreUsuario ?? '', email: usuario?.email ?? '', pw: '', rol: 'COMPRADOR' },
    validadores(editando),
  )

  const enviar = (e) => {
    e.preventDefault()
    if (Object.keys(f.validarTodo(e.currentTarget)).length) return
    const r = onGuardar(f.valores)
    if (r.error) f.setError(r.error, 'DUPLICADO')
    else onCerrar()
  }

  const campo = (nombre) => ({ name: nombre, value: f.valores[nombre], onChange: f.cambiar, onBlur: f.alSalir, error: f.errores[nombre] })

  return (
    <AdminModal titulo={editando ? `Editar a ${usuario.nombre}` : 'Crear usuario'} onCerrar={onCerrar}>
      <form className="aform" noValidate onSubmit={enviar}>
        <div className="two">
          <Field label="Nombre" autoComplete="off" {...campo('nombre')} />
          <Field label="Apellido" autoComplete="off" {...campo('apellido')} />
        </div>
        <Field label="Nombre de usuario" autoComplete="off" {...campo('nombreUsuario')} />
        <Field label="E-mail" type="email" autoComplete="off" {...campo('email')} />
        <PasswordField label={editando ? 'Nueva contraseña (vacía = no cambia)' : 'Contraseña (mín. 8, mayúscula, número y símbolo)'} autoComplete="new-password" {...campo('pw')} />
        {!editando && <SelectField label="Rol" opciones={ROLES} {...campo('rol')} />}
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
