import { useState } from 'react'
import { cambiarContraseniaApi, recuperarContraseniaApi } from '../api/authApi'
import useCuentaRegresiva from '../hooks/useCuentaRegresiva'
import useFormulario from '../hooks/useFormulario'
import { normalizarError } from '../utils/errorApi'
import { enmascararMail } from '../utils/format'
import Aviso from './Aviso'
import Field from './Field'
import PasswordField from './PasswordField'

// Paso 1: pedir el código. POST /api/v1/auth/recuperar-contrasenia { email } -> el back lo manda por e-mail (vale 15 min).
const PedirCodigo = ({ emailInicial, onEnviado, onVolver }) => {
  const { valores, cambiar, errores, error, tipoError, setError } = useFormulario({ email: emailInicial })
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    if (enviando) return
    setError('')
    setEnviando(true)
    try {
      const email = valores.email.trim()
      await recuperarContraseniaApi(email)
      onEnviado(email)
    } catch (err) {
      const info = normalizarError(err, 'verificacion') // 404 = "No encontramos una cuenta con ese e-mail"
      setError(info.mensaje, info.tipo)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="aform" noValidate onSubmit={enviar}>
      <h3 className="fr">¿Olvidaste tu contraseña?</h3>
      <p className="sell-note">Ingresá el e-mail de tu cuenta y te enviamos un código para elegir una contraseña nueva.</p>
      <Field label="E-mail" name="email" type="email" value={valores.email} onChange={cambiar} error={errores.email} autoComplete="email" />
      <Aviso mensaje={error} tipo={tipoError} />
      <button className="btn main" type="submit" disabled={enviando}>{enviando ? 'Enviando…' : 'Enviarme el código'}</button>
      <p className="alt-l"><a href="#" onClick={(e) => { e.preventDefault(); onVolver() }}>Volver a ingresar</a></p>
    </form>
  )
}

// Paso 2: código + contraseña nueva. POST /api/v1/auth/cambiar-contrasenia { email, codigo, nuevaContrasenia }
const NuevaContrasena = ({ email, onListo, onOtroMail }) => {
  const { valores, cambiar, errores, setErroresCampos, error, tipoError, setError } = useFormulario({ codigo: '', nuevaContrasenia: '', repetirNuevaContrasenia: '' })
  const [restante, reiniciarCuenta] = useCuentaRegresiva(30)
  const [enviando, setEnviando] = useState(false)
  const [aviso, setAviso] = useState('')

  const enviar = async (e) => {
    e.preventDefault()
    if (enviando) return
    setError('')
    setEnviando(true)
    try {
      await cambiarContraseniaApi({
        email,
        codigo: valores.codigo.trim(),
        nuevaContrasenia: valores.nuevaContrasenia,
        repetirNuevaContrasenia: valores.repetirNuevaContrasenia,
      })
      onListo()
    } catch (err) {
      const info = normalizarError(err, 'verificacion') // código inválido o vencido
      setErroresCampos(info.campos || {}) // los campos se llaman igual que en el back
      setError(info.mensaje, info.tipo)
    } finally {
      setEnviando(false)
    }
  }

  const reenviar = async () => {
    try {
      await recuperarContraseniaApi(email)
      reiniciarCuenta()
      cambiar('codigo', '') // el código anterior ya no sirve; la contraseña escrita se conserva
      setError('')
      setAviso('Te enviamos un código nuevo. El anterior ya no sirve.')
    } catch (err) {
      const info = normalizarError(err, 'verificacion')
      setError(info.mensaje, info.tipo)
    }
  }

  const props = (nombre) => ({ name: nombre, value: valores[nombre], onChange: cambiar, error: errores[nombre] })

  return (
    <form className="aform" noValidate onSubmit={enviar}>
      <h3 className="fr">Elegí tu contraseña nueva</h3>
      {aviso && <div className="note" role="status">{aviso}</div>}
      <p className="sell-note">
        Te enviamos un código de 6 dígitos a <b>{enmascararMail(email)}</b>. Vale 15 minutos. Revisá también la carpeta de spam.
      </p>
      <Field label="Código de recuperación" className="code-in" {...props('codigo')}
        inputMode="numeric" autoComplete="one-time-code" placeholder="000000" />
      <PasswordField label="Contraseña nueva (mín. 8, mayúscula, número y símbolo)" {...props('nuevaContrasenia')} autoComplete="new-password" />
      <PasswordField label="Repetir contraseña" {...props('repetirNuevaContrasenia')} autoComplete="new-password" />
      <Aviso mensaje={error} tipo={tipoError} />
      <button className="btn main" type="submit" disabled={enviando}>{enviando ? 'Guardando…' : 'Cambiar contraseña'}</button>
      <button className="btn alt" type="button" disabled={restante > 0} onClick={reenviar}>
        {restante > 0 ? `Reenviar código (${restante} s)` : 'Reenviar código'}
      </button>
      <p className="alt-l"><a href="#" onClick={(e) => { e.preventDefault(); onOtroMail() }}>Usar otro e-mail</a></p>
    </form>
  )
}

// Recuperar contraseña en dos pasos. `onListo()` cuando el back confirmó el cambio; `onVolver()` vuelve al login.
const RecoverForm = ({ emailInicial = '', onListo, onVolver }) => {
  const [email, setEmail] = useState(null) // null = todavía en el paso 1
  const [ultimo, setUltimo] = useState(emailInicial) // lo último escrito, para no tipearlo de nuevo al volver
  const enviado = (e) => { setUltimo(e); setEmail(e) }
  return email
    ? <NuevaContrasena key={email} email={email} onListo={onListo} onOtroMail={() => setEmail(null)} />
    : <PedirCodigo emailInicial={ultimo} onEnviado={enviado} onVolver={onVolver} />
}

export default RecoverForm
