import EmptyBlock from './EmptyBlock'
import SaleCard from './SaleCard'

// Historial de ventas (solo lectura: una venta pagada no se cancela)
const SellerSales = ({ ventas }) => {
  if (!ventas.length) return <EmptyBlock titulo="Todavía no tenés ventas" texto="Cuando alguien compre tus libros van a aparecer acá." />
  return ventas.map((v) => <SaleCard key={v.id} venta={v} />)
}

export default SellerSales
