import { buscarAvatar } from '../data/avatares'
import { initials } from '../utils/colors'

// Foto si hay; si no, el avatar elegido; si no, las iniciales. `perfil` = { avatar, foto }
const Avatar = ({ user, perfil = {}, size = 84 }) => {
  const medida = { width: size, height: size }
  if (perfil.foto) return <img className="uav" style={medida} src={perfil.foto} alt="Foto de perfil" />

  const avatar = buscarAvatar(perfil.avatar)
  if (avatar) return <img className="uav" style={medida} src={avatar.src} alt={avatar.nombre} width={size} height={size} />

  return (
    <span className="uav ini" style={{ ...medida, fontSize: size * 0.36 }}>
      {initials(`${user.nombre} ${user.apellido}`, 2).toUpperCase()}
    </span>
  )
}

export default Avatar
