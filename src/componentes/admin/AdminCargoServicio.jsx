import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useAdminCargoServicio from '../../hooks/useAdminCargoServicio'
import { fechaCorta, fmt, pct } from '../../utils/format'
import Aviso from '../comun/Aviso'
import CargoServicioModal from './CargoServicioModal'
import ShipCard from '../compra/ShipCard'

const EJEMPLO = 10000 // precio de libros del ejemplo

// Pestaña "Cargo de servicio" del panel de moderación: el porcentaje que la plataforma cobra en cada compra,
// sobre el precio de los libros (sin el envío), uno por orden. GET y PATCH /configuracion/cargo-servicio.
const AdminCargoServicio = () => {
  const dispatch = useDispatch()
  const cargoState = useSelector((state) => state.cargoServicio)
  const { porcentaje, fechaActualizacion, cargado, cargando, error, recargar, cambiar } = useAdminCargoServicio({ dispatch, ...cargoState })
  const [editando, setEditando] = useState(false)

  if (cargando) return <p className="sell-note" role="status">Cargando cargo de servicio…</p>

  if (error && !cargado) {
    return (
      <div className="mod-error">
        <Aviso mensaje={error} tipo="SERVIDOR" />
        <button className="lnk" type="button" onClick={recargar}>Reintentar</button>
      </div>
    )
  }

  const actual = porcentaje ?? 0
  return (
    <div>
      <div className="ship-grid" style={{ marginTop: 0 }}>
        <ShipCard titulo="Cargo de servicio" precio={pct(actual)}
          accion={<button className="btn alt adm-sm" type="button" onClick={() => setEditando(true)}>Cambiar porcentaje</button>}>
          Se cobra una vez por compra, sobre el precio de los libros (sin el envío).
          {fechaActualizacion ? ` Último cambio: ${fechaCorta(fechaActualizacion)}.` : ' Todavía no se configuró.'}
        </ShipCard>
        <div className="card ship-once" style={{ marginTop: 0 }}>
          <h3 className="fr">Cómo se calcula</h3>
          <p>El comprador ve el cargo en el resumen de su estantería, al pagar y en su historial de compras. No se descuenta de lo que cobra el vendedor.</p>
          <small>Ejemplo: libros por {fmt(EJEMPLO)} pagan un cargo de {fmt(Math.round(EJEMPLO * actual) / 100)} ({pct(actual)}), más el envío.</small>
        </div>
      </div>
      {editando && (
        <CargoServicioModal porcentajeActual={porcentaje} onGuardar={cambiar} onCerrar={() => setEditando(false)} />
      )}
    </div>
  )
}

export default AdminCargoServicio
