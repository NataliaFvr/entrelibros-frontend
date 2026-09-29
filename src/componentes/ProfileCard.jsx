const ProfileCard = ({ user }) => {
  const filas = [['Nombre', user.nombre], ['Apellido', user.apellido], ['Usuario', user.nombreUsuario], ['E-mail', user.email]]
  return (
    <div className="card spec spec1">
      {filas.map(([k, v]) => <div key={k}><span>{k}</span><b>{v}</b></div>)}
    </div>
  )
}

export default ProfileCard
