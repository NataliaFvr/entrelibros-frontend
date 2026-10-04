import { useState } from 'react'
import useFormulario from '../hooks/useFormulario'
import { getUsuarios } from '../services/authService'
import { CAMPOS_CUENTA, validadoresCuenta, validarCuenta } from '../utils/validaciones'
import { mapearCampos, normalizarError } from '../utils/errorApi'
import Avatar from './Avatar'
import AvatarPicker from './AvatarPicker'
import Aviso from './Aviso'
import PhotoControls from './PhotoControls'
import Field from './Field'
import PasswordField from './PasswordField'

// Al editar, la contraseña es opcional (vacía = no cambia): solo se valida si se escribe algo
const VALIDADORES = validadoresCuenta({ pwObligatoria: false })

const EditProfileForm = ({ user, perfil, onGuardar, onCancelar }) => {
  const { valores, cambiar, errores, alSalir, validarTodo, setErroresCampos, error, tipoError, setError } = useFormulario({
    nombre: user.nombre, apellido: user.apellido, nombreUsuario: user.nombreUsuario, email: user.email, pw: '',
  }, VALIDADORES, { enVivo: ['pw'] })
  // Avatar/foto en borrador: recién se guardan con "Guardar cambios"
  const [borrador, setBorrador] = useState({ avatar: perfil.avatar || '', foto: perfil.foto || '' })
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    if (enviando) return
    const malos = validarTodo(e.currentTarget)
    if (Object.keys(malos).length) return setError('Revisá los campos marcados antes de continuar.')
    const repetido = validarCuenta(valores, getUsuarios(), { actual: user.nombreUsuario, pwObligatoria: false }) // modo demo
    if (repetido) return setError(repetido, 'DUPLICADO')
    setError('')
    setEnviando(true)
    try {
      await onGuardar(valores, borrador)
    } catch (err) {
      const info = normalizarError(err, 'perfil')
      setErroresCampos(mapearCampos(info.campos, CAMPOS_CUENTA))
      setError(info.mensaje, info.tipo)
    } finally {
      setEnviando(false)
    }
  }

  const props = (nombre) => ({ name: nombre, value: valores[nombre], onChange: cambiar, onBlur: alSalir, error: errores[nombre] })

  return (
    <form className="card aform" noValidate onSubmit={enviar}>
      <h3 className="fr">Editar perfil</h3>
      <div className="ed-av">
        <Avatar user={user} perfil={borrador} size={72} />
        <PhotoControls onFoto={(foto) => setBorrador({ avatar: '', foto })} onQuitar={() => setBorrador({ ...borrador, foto: '' })} />
      </div>
      <AvatarPicker elegido={borrador.foto ? '' : borrador.avatar} onElegir={(avatar) => setBorrador({ avatar, foto: '' })} />
      <div className="two">
        <Field label="Nombre" {...props('nombre')} autoComplete="given-name" />
        <Field label="Apellido" {...props('apellido')} autoComplete="family-name" />
      </div>
      <Field label="Nombre de usuario" {...props('nombreUsuario')} autoComplete="username" />
      <Field label="E-mail" type="email" {...props('email')} autoComplete="email" />
      <PasswordField label="Nueva contraseña (vacía = no cambia)" {...props('pw')} autoComplete="new-password" />
      <Aviso mensaje={error} tipo={tipoError} />
      <div className="rvf-b">
        <button className="btn main" type="submit" disabled={enviando}>{enviando ? 'Guardando…' : 'Guardar cambios'}</button>
        <button className="btn alt" type="button" onClick={onCancelar}>Cancelar</button>
      </div>
    </form>
  )
}

export default EditProfileForm
