import { fmt, pct } from '../utils/format'
import SummaryRow from './SummaryRow'

// Fila "Cargo de servicio (5%)" de los resúmenes de precio. El monto y el porcentaje los calcula el back;
// si la orden no tiene cargo (por ejemplo, una anterior a esta funcionalidad) no se muestra.
const CargoServicioRow = ({ monto, porcentaje }) => {
  if (!monto) return null
  const titulo = porcentaje ? `Cargo de servicio (${pct(porcentaje)})` : 'Cargo de servicio'
  return <SummaryRow titulo={titulo} valor={fmt(monto)} />
}

export default CargoServicioRow
