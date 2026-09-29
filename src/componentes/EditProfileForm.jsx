import { useState } from 'react'
import useFormulario from '../hooks/useFormulario'
import { getUsuarios } from '../services/authService'
import { validarCuenta } from '../utils/validaciones'
import Avatar from './Avatar'
import AvatarPicker from './AvatarPicker'
import PhotoControls from './PhotoControls'
import Field from './Field'
import PasswordField from './PasswordField'

const EditProfileForm = ({ user, perfil, onGuardar, onCancelar }) => {
  const { valores, cambiar, error, setError } = useFormulario({
    nombre: user.nombre, apellido: user.apellido, nombreUsuario: user.nombreUsuario, email: user.email, pw: '',
  })
  // Avatar/foto en borrador: recién se guardan con "Guardar cambios"
  const [borrador, setBorrador] = useState({ avatar: perfil.avatar || '', foto: perfil.foto || '' })

  const enviar = (e) => {
    e.preventDefault()
    const mensaje = validarCuenta(valores, getUsuarios(), { actual: user.nombreUsuario, pwObligatoria: false })
    if (mensaje) return setError(mensaje)
    onGuardar(valores, borrador)
  }

  return (
    <form className="card aform" noValidate onSubmit={enviar}>
      <h3 className="fr">Editar perfil</h3>
      <div className="ed-av">
        <Avatar user={user} perfil={borrador} size={72} />
        <PhotoControls onFoto={(foto) => setBorrador({ avatar: '', foto })} onQuitar={() => setBorrador({ ...borrador, foto: '' })} />
      </div>
      <AvatarPicker elegido={borrador.foto ? '' : borrador.avatar} onElegir={(avatar) => setBorrador({ avatar, foto: '' })} />
      <div className="two">
        <Field label="Nombre" name="nombre" value={valores.nombre} onChange={cambiar} autoComplete="given-name" />
        <Field label="Apellido" name="apellido" value={valores.apellido} onChange={cambiar} autoComplete="family-name" />
      </div>
      <Field label="Nombre de usuario" name="nombreUsuario" value={valores.nombreUsuario} onChange={cambiar} autoComplete="username" />
      <Field label="E-mail" name="email" type="email" value={valores.email} onChange={cambiar} autoComplete="email" />
      <PasswordField label="Nueva contraseña (vacía = no cambia)" name="pw" value={valores.pw} onChange={cambiar} autoComplete="new-password" />
      <p className="ferr" role="alert">{error}</p>
      <div className="rvf-b">
        <button className="btn main" type="submit">Guardar cambios</button>
        <button className="btn alt" type="button" onClick={onCancelar}>Cancelar</button>
      </div>
    </form>
  )
}

export default EditProfileForm
