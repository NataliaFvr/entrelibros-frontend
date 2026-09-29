import { initials } from '../utils/colors'

const Avatar = ({ user, size = 84 }) => {
  return (
    <span className="uav ini" style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {initials(`${user.nombre} ${user.apellido}`, 2)}
    </span>
  )
}

export default Avatar
