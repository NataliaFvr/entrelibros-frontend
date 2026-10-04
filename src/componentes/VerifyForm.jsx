import { useState } from 'react'
import useCuentaRegresiva from '../hooks/useCuentaRegresiva'
import useFormulario from '../hooks/useFormulario'
import { normalizarError } from '../utils/errorApi'
import { enmascararMail } from '../utils/format'
import { validarCodigo } from '../utils/validaciones'
import Aviso from './Aviso'
import Field from './Field'

const VALIDADORES = { codigo: validarCodigo }

// `onConfirmar(codigo)` devuelve { error, tipo } si falló (código inválido, vencido, demasiados intentos…) o {} si quedó confirmada
const VerifyForm = ({ usuario, nota, onConfirmar, onReenviar, onVolver }) => {
  const { valores, cambiar, errores, alSalir, validarTodo, error, tipoError, setError, reiniciar } = useFormulario({ codigo: '' }, VALIDADORES)
  const [restante, reiniciarCuenta] = useCuentaRegresiva(30)
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    if (enviando) return
    if (Object.keys(validarTodo(e.currentTarget)).length) return
    setError('')
    setEnviando(true)
    try {
      const r = await onConfirmar(valores.codigo)
      if (r && r.error) setError(r.error, r.tipo)
    } finally {
      setEnviando(false)
    }
  }

  const reenviar = async () => {
    try {
      await onReenviar()
      reiniciarCuenta()
      reiniciar()
    } catch (err) {
      const info = normalizarError(err, 'verificacion')
      setError(info.mensaje, info.tipo)
    }
  }

  return (
    <form className="aform" noValidate onSubmit={enviar}>
      <h3 className="fr">Ingresá el código</h3>
      {nota && <div className="note">{nota}</div>}
      <p className="sell-note">
        Te enviamos un código de 6 dígitos a <b>{enmascararMail(usuario.email)}</b>. Revisá también la carpeta de spam.
      </p>
      <Field
        label="Código de confirmación" name="codigo" className="code-in" value={valores.codigo}
        onChange={(n, v) => cambiar(n, v.replace(/\D/g, ''))} onBlur={alSalir} error={errores.codigo}
        inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000"
      />
      <Aviso mensaje={error} tipo={tipoError} />
      <button className="btn main" type="submit" disabled={enviando}>{enviando ? 'Confirmando…' : 'Confirmar cuenta'}</button>
      <button className="btn alt" type="button" disabled={restante > 0} onClick={reenviar}>
        {restante > 0 ? `Reenviar código (${restante} s)` : 'Reenviar código'}
      </button>
      <p className="alt-l"><a href="#" onClick={(e) => { e.preventDefault(); onVolver() }}>Volver a ingresar</a></p>
    </form>
  )
}

export default VerifyForm
