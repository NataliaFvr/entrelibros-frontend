import { ETIQUETA_ROL } from '../data/admin'

// Una fila de la tabla de usuarios. En celular cada fila se muestra como una tarjeta (los data-label hacen de títulos).
const UsuarioFila = ({ usuario: u, onEditar, onRol, onBaja, onReactivar, onVenta }) => {
  return (
    <tr>
      <td data-label="Usuario" className="adm-c-user">
        <b>{u.nombre} {u.apellido}</b>
        <small>@{u.nombreUsuario}</small>
      </td>
      <td data-label="E-mail" className="adm-c-mail">{u.email}</td>
      <td data-label="Rol">
        <span className="adm-tags">
          <span className="tg b">{ETIQUETA_ROL[u.rol]}</span>
          {u.quiereVender && <span className="tg">Quiere vender</span>}
        </span>
      </td>
      <td data-label="Estado">
        <span className={`tg ${u.estado === 'ACTIVO' ? 'used' : 'off'}`}>{u.estado === 'ACTIVO' ? 'Activo' : 'De baja'}</span>
      </td>
      <td className="adm-c-acc r">
        <div className="adm-acts">
          <button className="lnk" type="button" onClick={() => onEditar(u)}>Editar</button>
          {u.quiereVender && (
            <>
              <button className="lnk" type="button" onClick={() => onVenta(u, true)}>Aprobar venta</button>
              <button className="lnk" type="button" onClick={() => onVenta(u, false)}>Rechazar</button>
            </>
          )}
          {u.propio ? (
            <span className="tg b">Tu cuenta</span>
          ) : (
            <>
              <button className="lnk" type="button" onClick={() => onRol(u)}>Rol</button>
              {u.estado === 'ACTIVO'
                ? <button className="lnk" type="button" onClick={() => onBaja(u)}>Dar de baja</button>
                : <button className="lnk" type="button" onClick={() => onReactivar(u)}>Reactivar</button>}
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

export default UsuarioFila
