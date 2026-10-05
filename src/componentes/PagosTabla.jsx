import { nombreMetodo } from '../data/metodosPago'
import { fmt } from '../utils/format'
import EtiquetaPago from './EtiquetaPago'

// Tabla de pagos registrados (celular y tablet: una tarjeta por pago)
const PagosTabla = ({ pagos }) => {
  return (
    <div className="card adm-tw">
      <table className="adm-table">
        <thead>
          <tr><th>Pago</th><th>Orden</th><th>Proveedor</th><th className="r">Monto</th><th>Resultado</th></tr>
        </thead>
        <tbody>
          {pagos.map((p) => (
            <tr key={p.id}>
              <td data-label="Pago" className="adm-c-user"><b>#{p.id}</b></td>
              <td data-label="Orden">#{p.n}</td>
              <td data-label="Proveedor">{nombreMetodo(p.proveedor)}</td>
              <td data-label="Monto" className="r">{fmt(p.monto)}</td>
              <td data-label="Resultado"><EtiquetaPago estado={p.resultado} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PagosTabla
