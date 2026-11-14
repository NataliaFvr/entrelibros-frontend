/* oxlint-disable no-unused-vars */
import { abrirGate,cerrarGate as cerrarGateAction,cancelarVerificacion,confirmarEmail,crearDireccion,eliminarDireccion as eliminarDireccionThunk,fetchUsuario,guardarPerfil,limpiarPendiente as limpiarPendienteAction,login as loginThunk,logout as logoutThunk,marcarPrincipal as marcarPrincipalThunk,NOTA_SIN_CONFIRMAR,quitarMarks as quitarMarksThunk,reenviarCodigo,registrar as registrarThunk,toggleMark as toggleMarkThunk } from '../redux/userSlice'
import {useDispatch,useSelector} from 'react-redux'
import { useState } from 'react'
import useFormulario from '../hooks/useFormulario'
import { CAMPOS_CUENTA } from '../utils/camposApi'
import { mapearCampos } from '../utils/errorApi'
import Aviso from './Aviso'
import Field from './Field'
import PasswordField from './PasswordField'

const INICIAL = { nombre: '', apellido: '', nombreUsuario: '', email: '', contrasena: '', repetirContrasena: '' }

const RegisterForm = ({ onPendiente, onIrALogin }) => {
  const dispatch=useDispatch()

  const errorDe=r=>({error:r.error.message,tipo:r.error.tipo,campos:r.error.campos||{}})
  const registrar=async(v)=>{const r=await dispatch(registrarThunk(v));return r.error?errorDe(r):{}}
  const { valores, cambiar, errores, setErroresCampos, error, tipoError, setError } = useFormulario(INICIAL)
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    if (enviando) return
    setError('')
    setEnviando(true)
    try {
      const r = await registrar(valores)
      if (r.error) {
        setErroresCampos(mapearCampos(r.campos, CAMPOS_CUENTA)) // errores de la API pintados en cada input
        return setError(r.error, r.tipo)
      }
      onPendiente()
    } finally {
      setEnviando(false)
    }
  }

  const props = (nombre) => ({ name: nombre, value: valores[nombre], onChange: cambiar, error: errores[nombre] })

  return (
    <form className="aform" noValidate onSubmit={enviar}>
      <div className="two">
        <Field label="Nombre" {...props('nombre')} autoComplete="given-name" />
        <Field label="Apellido" {...props('apellido')} autoComplete="family-name" />
      </div>
      <Field label="Nombre de usuario" {...props('nombreUsuario')} autoComplete="username" />
      <Field label="E-mail" type="email" {...props('email')} autoComplete="email" />
      <PasswordField label="Contraseña (mín. 8, mayúscula, número y símbolo)" {...props('contrasena')} autoComplete="new-password" />
      <PasswordField label="Repetir contraseña" {...props('repetirContrasena')} autoComplete="new-password" />
      <Aviso mensaje={error} tipo={tipoError} />
      <button className="btn main" type="submit" disabled={enviando}>{enviando ? 'Creando cuenta…' : 'Crear cuenta'}</button>
      <p className="alt-l">¿Ya tenés cuenta? <a href="#" onClick={(e) => { e.preventDefault(); onIrALogin() }}>Ingresá</a></p>
    </form>
  )
}

export default RegisterForm
