import UsuarioFila from './UsuarioFila'

const UsuariosTabla = ({ usuarios, ...acciones }) => {
  return (
    <div className="card adm-tw">
      <table className="adm-table">
        <thead>
          <tr><th>Usuario</th><th>E-mail</th><th>Rol</th><th>Estado</th><th className="r">Acciones</th></tr>
        </thead>
        <tbody>
          {usuarios.map((u) => <UsuarioFila key={u.id} usuario={u} {...acciones} />)}
        </tbody>
      </table>
    </div>
  )
}

export default UsuariosTabla
