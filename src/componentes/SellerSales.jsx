import EmptyBlock from './EmptyBlock'
import SaleCard from './SaleCard'

const SellerSales = ({ ventas }) => {
  if (!ventas.length) return <EmptyBlock titulo="Todavía no tenés ventas" texto="Cuando alguien compre tus libros van a aparecer acá." />
  return ventas.map((v) => <SaleCard key={`${v.n}-${v.comprador}`} venta={v} />)
}

export default SellerSales
