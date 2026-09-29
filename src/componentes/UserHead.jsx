import Avatar from './Avatar'

const UserHead = ({ user, perfil, onLogout }) => {
  return (
    <div className="u-head card">
      <Avatar user={user} perfil={perfil} />
      <div className="u-id">
        <h1 className="fr">{user.nombre} {user.apellido}</h1>
        <p>@{user.nombreUsuario} · {user.email}</p>
      </div>
      <button className="btn alt u-out" type="button" onClick={onLogout}>Cerrar sesión</button>
    </div>
  )
}

export default UserHead
