import { login as loginThunk,NOTA_SIN_CONFIRMAR,reenviarCodigo } from '../redux/userSlice'
import {useDispatch} from 'react-redux'
import { useState } from 'react'
import useFormulario from '../hooks/useFormulario'
import Aviso from './Aviso'
import Field from './Field'
import PasswordField from './PasswordField'

const LoginForm = ({ onListo, onPendiente, onIrARegistro, onOlvide }) => {
  const dispatch=useDispatch()

  const errorDe=r=>({error:r.error.message,tipo:r.error.tipo,campos:r.error.campos||{}})
  const login=async(i,c)=>{const r=await dispatch(loginThunk({ident:i,contrasena:c}));if(!r.error)return{};if(r.error.tipo==='CUENTA_NO_CONFIRMADA'){dispatch(reenviarCodigo({email:i.trim(),nota:NOTA_SIN_CONFIRMAR}));return{pendiente:true}}return errorDe(r)}
  const { valores, cambiar, errores, error, tipoError, setError } = useFormulario({ email: '', contrasena: '' })
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    if (enviando) return
    setError('')
    setEnviando(true)
    try {
      // login() ya traduce los errores HTTP de la API (401, 403, 404…) a { error, tipo }
      const r = await login(valores.email, valores.contrasena)
      if (r.error) return setError(r.error, r.tipo)
      if (r.pendiente) return onPendiente()
      onListo()
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="aform" noValidate onSubmit={enviar}>
      <Field label="E-mail" name="email" type="email" value={valores.email} onChange={cambiar} error={errores.email} autoComplete="email" />
      <PasswordField label="Contraseña" name="contrasena" value={valores.contrasena} onChange={cambiar} error={errores.contrasena} autoComplete="current-password" />
      {onOlvide && <p className="alt-l forgot"><a href="#" onClick={(e) => { e.preventDefault(); onOlvide(valores.email.trim()) }}>¿Olvidaste tu contraseña?</a></p>}
      <Aviso mensaje={error} tipo={tipoError} />
      <button className="btn main" type="submit" disabled={enviando}>{enviando ? 'Entrando…' : 'Entrar'}</button>
      <p className="alt-l">¿No tenés cuenta? <a href="#" onClick={(e) => { e.preventDefault(); onIrARegistro() }}>Registrate</a></p>
    </form>
  )
}

export default LoginForm
