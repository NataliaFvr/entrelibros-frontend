import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import useFormulario from '../hooks/useFormulario'
import { getUsuarios } from '../services/authService'
import { CAMPOS_CUENTA, validadoresCuenta, validarCuenta } from '../utils/validaciones'
import { mapearCampos } from '../utils/errorApi'
import Aviso from './Aviso'
import Field from './Field'
import PasswordField from './PasswordField'

const INICIAL = { nombre: '', apellido: '', nombreUsuario: '', email: '', pw: '', pw2: '' }
const VALIDADORES = validadoresCuenta()
// La contraseña se valida mientras se escribe; el resto, al salir del campo (y desde entonces, en vivo)
const EN_VIVO = ['pw', 'pw2']

const RegisterForm = ({ onPendiente, onIrALogin }) => {
  const { registrar } = useAuth()
  const { valores, cambiar, errores, alSalir, validarTodo, setErroresCampos, error, tipoError, setError } = useFormulario(INICIAL, VALIDADORES, { enVivo: EN_VIVO })
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    if (enviando) return
    const malos = validarTodo(e.currentTarget)
    if (Object.keys(malos).length) return setError('Revisá los campos marcados antes de continuar.')
    // Modo demo: usuario y e-mail repetidos se chequean contra las cuentas del navegador.
    // Con el back esto se borra: la API responde 409 y registrar() lo devuelve como tipo DUPLICADO.
    const repetido = validarCuenta(valores, getUsuarios())
    if (repetido) return setError(repetido, 'DUPLICADO')
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

  const props = (nombre) => ({ name: nombre, value: valores[nombre], onChange: cambiar, onBlur: alSalir, error: errores[nombre] })

  return (
    <form className="aform" noValidate onSubmit={enviar}>
      <div className="two">
        <Field label="Nombre" {...props('nombre')} autoComplete="given-name" />
        <Field label="Apellido" {...props('apellido')} autoComplete="family-name" />
      </div>
      <Field label="Nombre de usuario" {...props('nombreUsuario')} autoComplete="username" />
      <Field label="E-mail" type="email" {...props('email')} autoComplete="email" />
      <PasswordField label="Contraseña (mín. 8, mayúscula, número y símbolo)" {...props('pw')} autoComplete="new-password" />
      <PasswordField label="Repetir contraseña" {...props('pw2')} autoComplete="new-password" />
      <Aviso mensaje={error} tipo={tipoError} />
      <button className="btn main" type="submit" disabled={enviando}>{enviando ? 'Creando cuenta…' : 'Crear cuenta'}</button>
      <p className="alt-l">¿Ya tenés cuenta? <a href="#" onClick={(e) => { e.preventDefault(); onIrALogin() }}>Ingresá</a></p>
    </form>
  )
}

export default RegisterForm
