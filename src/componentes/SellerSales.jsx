import EmptyBlock from './EmptyBlock'
import SaleCard from './SaleCard'

// Historial de ventas, de la más nueva a la más vieja: reservadas sin pagar, pagadas, canceladas y vencidas
const SellerSales = ({ ventas, onCancelar }) => {
  if (!ventas.length) return <EmptyBlock titulo="Todavía no tenés ventas" texto="Cuando alguien compre tus libros van a aparecer acá." />
  return ventas.map((v) => <SaleCard key={v.id} venta={v} onCancelar={onCancelar} />)
}

export default SellerSales
