import { AVATARES } from '../data/avatares'
import { initials } from '../utils/colors'
import AvatarSvg from './AvatarSvg'

// Foto si hay; si no, el avatar elegido; si no, las iniciales. `perfil` = { avatar, foto }
const Avatar = ({ user, perfil = {}, size = 84 }) => {
  const medida = { width: size, height: size }
  if (perfil.foto) return <img className="uav" style={medida} src={perfil.foto} alt="Foto de perfil" />

  const i = AVATARES.findIndex(([clave]) => clave === perfil.avatar)
  if (i >= 0) return <span className="uav" style={medida}><AvatarSvg indice={i} /></span>

  return (
    <span className="uav ini" style={{ ...medida, fontSize: size * 0.36 }}>
      {initials(`${user.nombre} ${user.apellido}`, 2).toUpperCase()}
    </span>
  )
}

export default Avatar
