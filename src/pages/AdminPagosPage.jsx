import useAdminPagos from '../hooks/useAdminPagos'
import { fmt } from '../utils/format'
import AdminHead from '../componentes/AdminHead'
import AdminKpi from '../componentes/AdminKpi'
import EmptyBlock from '../componentes/EmptyBlock'
import Pager from '../componentes/Pager'
import PagosTabla from '../componentes/PagosTabla'

// /admin/pagos — pagos registrados (los cobros son simulados)
const AdminPagosPage = () => {
  const adm = useAdminPagos()

  return (
    <main className="usr">
      <AdminHead seccion="Pagos" titulo="Pagos" sub="Pagos registrados. Los cobros son simulados." />
      <div className="adm-stack">
        <div className="adm-kpis adm-kpis-3">
          <AdminKpi valor={fmt(adm.totalAprobado)} etiqueta="Total aprobado" />
          <AdminKpi valor={adm.aprobados} etiqueta="Aprobados" />
          <AdminKpi valor={adm.rechazados} etiqueta="Rechazados" />
        </div>
        {adm.hayPagos
          ? <PagosTabla pagos={adm.visibles} />
          : <EmptyBlock titulo="Todavía no hay pagos" texto="Cuando alguien pague una compra va a aparecer acá." />}
      </div>
      <Pager page={adm.pagina} pages={adm.paginas} onChange={adm.setPagina} />
    </main>
  )
}

export default AdminPagosPage
