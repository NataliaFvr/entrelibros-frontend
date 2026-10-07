import { useState } from 'react'
import { buscarAvatar } from '../data/avatares'
import { initials } from '../utils/colors'

// Foto si hay y carga bien; si no, el avatar elegido; si no, las iniciales. `perfil` = { avatar, foto }
// `foto` puede ser una URL (/usuarios/{id}/foto) o una imagen en base64 (vista previa). Si la URL falla (404), cae al avatar (onError).
const Avatar = ({ user, perfil = {}, size = 84 }) => {
  const [rota, setRota] = useState('')
  const medida = { width: size, height: size }
  if (perfil.foto && rota !== perfil.foto) {
    return <img className="uav" style={medida} src={perfil.foto} alt="Foto de perfil" onError={() => setRota(perfil.foto)} />
  }

  const avatar = buscarAvatar(perfil.avatar)
  if (avatar) return <img className="uav" style={medida} src={avatar.src} alt={avatar.nombre} width={size} height={size} />

  return (
    <span className="uav ini" style={{ ...medida, fontSize: size * 0.36 }}>
      {initials(`${user.nombre} ${user.apellido}`, 2).toUpperCase()}
    </span>
  )
}

export default Avatar
