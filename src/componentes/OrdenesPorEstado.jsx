import { ETIQUETAS_PAGO } from '../utils/pedidos'

// Barras con la cantidad de órdenes en cada estado de pago. `porEstado` = [[estado, cantidad]].
const OrdenesPorEstado = ({ porEstado, total }) => {
  return (
    <div className="card">
      <h3 className="fr adm-card-t">Órdenes por estado de pago</h3>
      {!porEstado.length && <p className="note">Todavía no hay órdenes.</p>}
      {porEstado.map(([estado, cantidad]) => (
        <div className="adm-barra" key={estado}>
          <span>{ETIQUETAS_PAGO[estado][0]}</span>
          <div className="bar"><i style={{ width: `${(cantidad / total) * 100}%` }} /></div>
          <span className="adm-barra-n">{cantidad}</span>
        </div>
      ))}
    </div>
  )
}

export default OrdenesPorEstado
