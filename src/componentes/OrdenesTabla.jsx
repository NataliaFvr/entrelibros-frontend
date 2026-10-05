import { fechaCorta, fmt } from '../utils/format'
import EtiquetaPago from './EtiquetaPago'

// Tabla de órdenes. En celular y tablet cada fila se muestra como tarjeta (los data-label hacen de títulos).
const OrdenesTabla = ({ ordenes, onVerDetalle }) => {
  return (
    <div className="card adm-tw">
      <table className="adm-table">
        <thead>
          <tr><th>Orden</th><th>Fecha</th><th>Comprador</th><th>Destino</th><th className="r">Total</th><th>Pago</th><th><span className="adm-sr">Acciones</span></th></tr>
        </thead>
        <tbody>
          {ordenes.map((o) => (
            <tr key={o.n}>
              <td data-label="Orden" className="adm-c-user"><b>#{o.n}</b></td>
              <td data-label="Fecha">{fechaCorta(o.fecha)}</td>
              <td data-label="Comprador">{o.comprador}</td>
              <td data-label="Destino">{o.provincia}</td>
              <td data-label="Total" className="r">{fmt(o.total)}</td>
              <td data-label="Pago"><EtiquetaPago estado={o.estadoPago} /></td>
              <td className="adm-c-acc r">
                <div className="adm-acts">
                  <button className="lnk" type="button" onClick={() => onVerDetalle(o)}>Ver detalle</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrdenesTabla
