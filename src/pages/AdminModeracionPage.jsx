import AdminHead from '../componentes/AdminHead'
import AdminModeracionPanel from '../componentes/AdminModeracionPanel'

// /admin/moderacion — el acceso solo para ADMIN y el marco (barra y pie) los pone AdminLayout
const AdminModeracionPage = () => {
  return (
    <main className="usr">
      <AdminHead seccion="Moderación" titulo="Moderación" sub="Revisá las publicaciones nuevas y las modificaciones pendientes." />
      <AdminModeracionPanel />
    </main>
  )
}

export default AdminModeracionPage
