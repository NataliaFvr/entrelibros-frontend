const ProfileCard = ({ user, onEditar }) => {
  const filas = [['Nombre', user.nombre], ['Apellido', user.apellido], ['Usuario', `@${user.nombreUsuario}`], ['E-mail', user.email]]
  return (
    <div className="card">
      <div className="spec1">
        {filas.map(([k, v]) => <div key={k}><span>{k}</span><b>{v}</b></div>)}
      </div>
      <button className="btn main u-btn" type="button" onClick={onEditar}>Editar perfil</button>
    </div>
  )
}

export default ProfileCard
