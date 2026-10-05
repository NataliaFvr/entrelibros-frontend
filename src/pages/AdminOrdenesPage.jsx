import { useState } from 'react'
import useAdminOrdenes from '../hooks/useAdminOrdenes'
import { ETIQUETAS_PAGO } from '../utils/pedidos'
import AdminHead from '../componentes/AdminHead'
import EmptyBlock from '../componentes/EmptyBlock'
import OrdenDetalleModal from '../componentes/OrdenDetalleModal'
import OrdenesTabla from '../componentes/OrdenesTabla'
import Pager from '../componentes/Pager'

// /admin/ordenes — todas las compras de la plataforma, solo lectura
const AdminOrdenesPage = () => {
  const adm = useAdminOrdenes()
  const [detalle, setDetalle] = useState(null)

  return (
    <main className="usr">
      <AdminHead seccion="Órdenes" titulo="Órdenes" sub="Todas las compras de la plataforma. Solo lectura." />
      <div className="adm-filters">
        <select className="fsel" aria-label="Estado de pago" value={adm.estado} onChange={(e) => adm.filtrar(e.target.value)}>
          <option value="">Todos los estados</option>
          {Object.entries(ETIQUETAS_PAGO).map(([valor, [texto]]) => <option key={valor} value={valor}>{texto}</option>)}
        </select>
      </div>
      {adm.total
        ? <OrdenesTabla ordenes={adm.visibles} onVerDetalle={setDetalle} />
        : adm.hayOrdenes
          ? <EmptyBlock titulo="No hay órdenes con ese estado" texto="Probá con otro filtro." />
          : <EmptyBlock titulo="Todavía no hay órdenes" texto="Cuando alguien compre en la tienda van a aparecer acá." />}
      <Pager page={adm.pagina} pages={adm.paginas} onChange={adm.setPagina} />
      {detalle && <OrdenDetalleModal orden={detalle} onCerrar={() => setDetalle(null)} />}
    </main>
  )
}

export default AdminOrdenesPage
