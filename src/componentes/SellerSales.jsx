import EmptyBlock from './EmptyBlock'
import SaleCard from './SaleCard'

// Historial de ventas. `onCancelar(venta)` cancela la parte del vendedor;
// `ocupado` = id de la venta con una acción en curso.
const SellerSales = ({ ventas, ocupado, onCancelar }) => {
  if (!ventas.length) return <EmptyBlock titulo="Todavía no tenés ventas" texto="Cuando alguien compre tus libros van a aparecer acá." />
  return ventas.map((v) => (
    <SaleCard key={v.id} venta={v} ocupado={ocupado === v.id} onCancelar={() => onCancelar(v)} />
  ))
}

export default SellerSales
