import { useAuth } from '../hooks/useAuth'
import useFormulario from '../hooks/useFormulario'
import Field from './Field'
import PasswordField from './PasswordField'

const LoginForm = ({ onListo, onPendiente, onIrARegistro }) => {
  const { login } = useAuth()
  const { valores, cambiar, error, setError } = useFormulario({ ident: '', pw: '' })

  const enviar = (e) => {
    e.preventDefault()
    if (!valores.ident.trim() || !valores.pw) return setError('Completá tu usuario y contraseña.')
    const r = login(valores.ident, valores.pw)
    if (r.error) return setError(r.error)
    if (r.pendiente) return onPendiente()
    onListo()
  }

  return (
    <form className="aform" noValidate onSubmit={enviar}>
      <Field label="Usuario o e-mail" name="ident" value={valores.ident} onChange={cambiar} autoComplete="username" />
      <PasswordField label="Contraseña" name="pw" value={valores.pw} onChange={cambiar} autoComplete="current-password" />
      <p className="ferr" role="alert">{error}</p>
      <button className="btn main" type="submit">Entrar</button>
      <p className="alt-l">¿No tenés cuenta? <a href="#" onClick={(e) => { e.preventDefault(); onIrARegistro() }}>Registrate</a></p>
    </form>
  )
}

export default LoginForm
