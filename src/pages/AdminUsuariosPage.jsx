import { useState } from 'react'
import useAdminUsuarios from '../hooks/useAdminUsuarios'
import { ESTADOS_USUARIO, ROLES } from '../data/admin'
import { plural } from '../utils/format'
import AdminHead from '../componentes/AdminHead'
import ConfirmarBajaModal from '../componentes/ConfirmarBajaModal'
import EmptyBlock from '../componentes/EmptyBlock'
import Pager from '../componentes/Pager'
import RolModal from '../componentes/RolModal'
import UsuarioFormModal from '../componentes/UsuarioFormModal'
import UsuariosTabla from '../componentes/UsuariosTabla'

// /admin/usuarios — crear, editar, cambiar rol, dar de baja / reactivar y resolver solicitudes de venta
const AdminUsuariosPage = () => {
  const adm = useAdminUsuarios()
  const [modal, setModal] = useState(null) // { tipo: 'crear' | 'editar' | 'rol' | 'baja', usuario? }
  const cerrar = () => setModal(null)
  const abrir = (tipo) => (usuario) => setModal({ tipo, usuario })

  return (
    <main className="usr">
      <AdminHead seccion="Usuarios" titulo="Usuarios" sub={`${adm.total} ${plural(adm.total, 'usuario', 'usuarios')}`}>
        <button className="btn main" type="button" onClick={() => setModal({ tipo: 'crear' })}>Crear usuario</button>
      </AdminHead>

      <div className="adm-filters">
        <input type="search" placeholder="Buscar por nombre, usuario o e-mail" aria-label="Buscar usuarios"
          value={adm.filtros.q} onChange={(e) => adm.filtrar('q', e.target.value)} />
        <select className="fsel" aria-label="Rol" value={adm.filtros.rol} onChange={(e) => adm.filtrar('rol', e.target.value)}>
          <option value="">Todos los roles</option>
          {ROLES.map(([valor, etiqueta]) => <option key={valor} value={valor}>{etiqueta}</option>)}
        </select>
        <select className="fsel" aria-label="Estado" value={adm.filtros.est} onChange={(e) => adm.filtrar('est', e.target.value)}>
          <option value="">Todos los estados</option>
          {ESTADOS_USUARIO.map(([valor, etiqueta]) => <option key={valor} value={valor}>{etiqueta}</option>)}
        </select>
      </div>

      {adm.visibles.length
        ? (
          <UsuariosTabla usuarios={adm.visibles} onEditar={abrir('editar')} onRol={abrir('rol')} onBaja={abrir('baja')}
            onReactivar={adm.reactivar} onVenta={adm.resolverVenta} />
        )
        : <EmptyBlock titulo="No encontramos usuarios" texto="Probá con otra búsqueda o quitá algún filtro." />}
      <Pager page={adm.pagina} pages={adm.paginas} onChange={adm.setPagina} />

      {modal?.tipo === 'crear' && <UsuarioFormModal onGuardar={adm.crear} onCerrar={cerrar} />}
      {modal?.tipo === 'editar' && <UsuarioFormModal usuario={modal.usuario} onGuardar={(v) => adm.editar(modal.usuario, v)} onCerrar={cerrar} />}
      {modal?.tipo === 'rol' && <RolModal usuario={modal.usuario} onGuardar={(rol, datos) => adm.cambiarRol(modal.usuario, rol, datos)} onCerrar={cerrar} />}
      {modal?.tipo === 'baja' && <ConfirmarBajaModal usuario={modal.usuario} onConfirmar={() => adm.darDeBaja(modal.usuario)} onCerrar={cerrar} />}
    </main>
  )
}

export default AdminUsuariosPage
