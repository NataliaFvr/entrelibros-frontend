import { useAuth } from '../hooks/useAuth'
import useFormulario from '../hooks/useFormulario'
import { getUsuarios } from '../services/authService'
import { validarRegistro } from '../utils/validaciones'
import Field from './Field'
import PasswordField from './PasswordField'

const INICIAL = { nombre: '', apellido: '', nombreUsuario: '', email: '', pw: '', pw2: '' }

const RegisterForm = ({ onListo, onIrALogin }) => {
  const { registrar } = useAuth()
  const { valores, cambiar, error, setError } = useFormulario(INICIAL)

  const enviar = (e) => {
    e.preventDefault()
    const mensaje = validarRegistro(valores, getUsuarios())
    if (mensaje) return setError(mensaje)
    registrar(valores)
    onListo()
  }

  return (
    <form className="aform" noValidate onSubmit={enviar}>
      <div className="two">
        <Field label="Nombre" name="nombre" value={valores.nombre} onChange={cambiar} autoComplete="given-name" />
        <Field label="Apellido" name="apellido" value={valores.apellido} onChange={cambiar} autoComplete="family-name" />
      </div>
      <Field label="Nombre de usuario" name="nombreUsuario" value={valores.nombreUsuario} onChange={cambiar} autoComplete="username" />
      <Field label="E-mail" name="email" type="email" value={valores.email} onChange={cambiar} autoComplete="email" />
      <PasswordField label="Contraseña (mín. 8, mayúscula, número y símbolo)" name="pw" value={valores.pw} onChange={cambiar} autoComplete="new-password" />
      <PasswordField label="Repetir contraseña" name="pw2" value={valores.pw2} onChange={cambiar} autoComplete="new-password" />
      <p className="ferr" role="alert">{error}</p>
      <button className="btn main" type="submit">Crear cuenta</button>
      <p className="alt-l">¿Ya tenés cuenta? <a href="#" onClick={(e) => { e.preventDefault(); onIrALogin() }}>Ingresá</a></p>
    </form>
  )
}

export default RegisterForm
