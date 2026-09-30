import { envioPorVendedor } from '../utils/envio'
import { fmt } from '../utils/format'
import SummaryRow from './SummaryRow'

// Un envío por vendedor
const ShippingLines = ({ items, libros }) => {
  return (
    <div className="csum-ship">
      <h3 className="fr">Envíos</h3>
      {envioPorVendedor(items, libros).map((e) => (
        <SummaryRow key={e.vendedor} titulo={e.vendedor} detalle={e.tipo === 'misma' ? 'Misma provincia' : 'Provincia distinta'} valor={fmt(e.costo)} />
      ))}
    </div>
  )
}

export default ShippingLines
