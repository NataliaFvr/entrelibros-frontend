import { useState } from 'react'
import useCuentaRegresiva from '../hooks/useCuentaRegresiva'
import { enmascararMail } from '../utils/format'

const VerifyForm = ({ usuario, nota, onConfirmar, onReenviar, onVolver }) => {
  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState('')
  const [restante, reiniciar] = useCuentaRegresiva(30)

  const enviar = (e) => {
    e.preventDefault()
    const mensaje = onConfirmar(codigo)
    if (mensaje) setError(mensaje)
  }

  const reenviar = () => {
    onReenviar()
    reiniciar()
    setCodigo('')
    setError('')
  }

  return (
    <form className="aform" noValidate onSubmit={enviar}>
      <h3 className="fr">Ingresá el código</h3>
      {nota && <div className="note">{nota}</div>}
      <p className="sell-note">
        Te enviamos un código de 6 dígitos a <b>{enmascararMail(usuario.email)}</b>. Revisá también la carpeta de spam.
      </p>
      <label className="fld">
        Código de confirmación
        <input className="code-in" type="text" name="codigo" value={codigo} inputMode="numeric" autoComplete="one-time-code"
          maxLength={6} placeholder="000000" onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))} />
      </label>
      <p className="ferr" role="alert">{error}</p>
      <button className="btn main" type="submit">Confirmar cuenta</button>
      <button className="btn alt" type="button" disabled={restante > 0} onClick={reenviar}>
        {restante > 0 ? `Reenviar código (${restante} s)` : 'Reenviar código'}
      </button>
      <p className="alt-l"><a href="#" onClick={(e) => { e.preventDefault(); onVolver() }}>Volver a ingresar</a></p>
    </form>
  )
}

export default VerifyForm
