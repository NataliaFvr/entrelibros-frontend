import { useNavigate } from 'react-router-dom'
import useAdminResumen from '../hooks/useAdminResumen'
import { fmt } from '../utils/format'
import AdminHead from '../componentes/AdminHead'
import AdminKpi from '../componentes/AdminKpi'
import OrdenesPorEstado from '../componentes/OrdenesPorEstado'
import PendientesModeracion from '../componentes/PendientesModeracion'

// /admin — lo que necesita atención hoy
const AdminResumenPage = () => {
  const navigate = useNavigate()
  const r = useAdminResumen()

  return (
    <main className="usr">
      <AdminHead seccion="Resumen" titulo="Panel de administración" sub="Lo que necesita tu atención hoy." />
      <div className="adm-stack">
        <div className="adm-kpis">
          <AdminKpi to="/admin/moderacion" valor={r.cargando ? '…' : r.pendientes.length} etiqueta="Libros para moderar" />
          <AdminKpi to="/admin/usuarios" valor={r.usuariosActivos} etiqueta="Usuarios activos" />
          <AdminKpi to="/admin/ordenes" valor={r.totalOrdenes} etiqueta="Órdenes" />
          <AdminKpi to="/admin/pagos" valor={fmt(r.cobrado)} etiqueta="Pagos aprobados" />
        </div>
        <div className="adm-two">
          <PendientesModeracion pendientes={r.pendientes} cargando={r.cargando} error={r.error} onRevisar={() => navigate('/admin/moderacion')} />
          <OrdenesPorEstado porEstado={r.porEstado} total={r.totalOrdenes} />
        </div>
      </div>
    </main>
  )
}

export default AdminResumenPage
