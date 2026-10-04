import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import useFormulario from '../hooks/useFormulario'
import { validadoresLogin } from '../utils/validaciones'
import Aviso from './Aviso'
import Field from './Field'
import PasswordField from './PasswordField'

const LoginForm = ({ onListo, onPendiente, onIrARegistro }) => {
  const { login } = useAuth()
  const { valores, cambiar, errores, alSalir, validarTodo, error, tipoError, setError } = useFormulario({ ident: '', pw: '' }, validadoresLogin)
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    if (enviando) return
    const malos = validarTodo(e.currentTarget) // formato de e-mail y largo de la contraseña, antes de llamar a la API
    if (Object.keys(malos).length) return setError('Revisá los campos marcados antes de continuar.')
    setError('')
    setEnviando(true)
    try {
      // login() ya traduce los errores HTTP de la API (401, 403, 404…) a { error, tipo }
      const r = await login(valores.ident, valores.pw)
      if (r.error) return setError(r.error, r.tipo)
      if (r.pendiente) return onPendiente()
      onListo()
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="aform" noValidate onSubmit={enviar}>
      <Field label="Usuario o e-mail" name="ident" value={valores.ident} onChange={cambiar} onBlur={alSalir} error={errores.ident} autoComplete="username" />
      <PasswordField label="Contraseña" name="pw" value={valores.pw} onChange={cambiar} onBlur={alSalir} error={errores.pw} autoComplete="current-password" />
      <Aviso mensaje={error} tipo={tipoError} />
      <button className="btn main" type="submit" disabled={enviando}>{enviando ? 'Entrando…' : 'Entrar'}</button>
      <p className="alt-l">¿No tenés cuenta? <a href="#" onClick={(e) => { e.preventDefault(); onIrARegistro() }}>Registrate</a></p>
    </form>
  )
}

export default LoginForm
