import { useState } from 'react'
import useModeracionPanel from '../hooks/useModeracionPanel'
import { USAR_API_LIBROS } from '../utils/modoApi'
import AccountTabs from './AccountTabs'
import Aviso from './Aviso'
import EmptyBlock from './EmptyBlock'
import ModeracionItem from './ModeracionItem'
import RechazoModal from './RechazoModal'
import './AdminModeracion.css'

const VACIO = {
  NUEVO: ['No hay publicaciones nuevas para revisar', 'Cuando un vendedor publique un libro, va a aparecer acá.'],
  MODIFICACION: ['No hay modificaciones pendientes', 'Cuando un vendedor edite un libro ya aprobado, vas a ver los cambios lado a lado.'],
}

// Panel del administrador: pestañas Nuevas / Modificaciones, comparador de cambios y decisión (aprobar / rechazar con motivo).
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
      {!cargando && !error && !visibles.length && tab === 'MODIFICACION' && USAR_API_LIBROS && (
        <p className="sell-note">Hoy el servidor publica las ediciones de un libro aceptado sin pasar por revisión, por eso esta lista queda vacía.</p>
      )}
      <div className="mod-list">
        {visibles.map((s) => (
          <ModeracionItem key={s.id} solicitud={s} ocupado={procesando === s.id}
            onAprobar={() => aprobar(s)} onRechazar={() => setARechazar(s)} />
        ))}
      </div>
      {aRechazar && (
        <RechazoModal titulo={aRechazar.datosPropuestos.titulo} onCerrar={() => setARechazar(null)}
          onConfirmar={(motivo) => rechazar(aRechazar, motivo)} />
      )}
    </>
  )
}

export default AdminModeracionPanel
