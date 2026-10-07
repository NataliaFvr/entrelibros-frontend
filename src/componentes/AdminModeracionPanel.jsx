import { useState } from 'react'
import useModeracionPanel from '../hooks/useModeracionPanel'
import AccountTabs from './AccountTabs'
import Aviso from './Aviso'
import CarruselModeracion from './CarruselModeracion'
import EmptyBlock from './EmptyBlock'
import ModeracionItem from './ModeracionItem'
import RechazoModal from './RechazoModal'
import './AdminModeracion.css'

const VACIO = {
  NUEVO: ['No hay publicaciones nuevas para revisar', 'Cuando un vendedor publique un libro, va a aparecer acá.'],
  MODIFICACION: ['No hay modificaciones pendientes', 'Cuando un vendedor edite un libro ya aprobado, vuelve a revisión y aparece acá.'],
}

// Panel del administrador: pestañas Nuevas / Modificaciones (misma cola, filtrada por tipo), carrusel de tarjetas
// de la más antigua a la más reciente, y decisión (aprobar / rechazar con motivo).
const AdminModeracionPanel = () => {
  const { visibles, cantidad, cargando, error, tab, setTab, procesando, aprobar, rechazar, recargarCola } = useModeracionPanel()
  const [aRechazar, setARechazar] = useState(null) // solicitud cuyo motivo se está pidiendo

  const pestanias = [['NUEVO', `Nuevas publicaciones (${cantidad('NUEVO')})`], ['MODIFICACION', `Modificaciones pendientes (${cantidad('MODIFICACION')})`]]

  return (
    <>
      <AccountTabs pestanias={pestanias} tab={tab} onIr={setTab} />
      {error && (
        <div className="mod-error">
          <Aviso mensaje={error} tipo="SERVIDOR" />
          <button className="lnk" type="button" onClick={recargarCola}>Reintentar</button>
        </div>
      )}
      {cargando && <p className="sell-note" role="status">Cargando solicitudes…</p>}
      {!cargando && !error && !visibles.length && <EmptyBlock titulo={VACIO[tab][0]} texto={VACIO[tab][1]} />}
      {!cargando && !error && visibles.length > 0 && (
        // key={tab}: al cambiar de pestaña el carrusel vuelve a la primera tarjeta
        <CarruselModeracion key={tab} items={visibles} etiqueta={tab === 'NUEVO' ? 'Nuevas publicaciones' : 'Modificaciones pendientes'}
          renderItem={(s) => (
            <ModeracionItem solicitud={s} ocupado={procesando === s.id}
              onAprobar={() => aprobar(s)} onRechazar={() => setARechazar(s)} />
          )} />
      )}
      {aRechazar && (
        <RechazoModal titulo={aRechazar.datosPropuestos.titulo} onCerrar={() => setARechazar(null)}
          onConfirmar={(motivo) => rechazar(aRechazar, motivo)} />
      )}
    </>
  )
}

export default AdminModeracionPanel
