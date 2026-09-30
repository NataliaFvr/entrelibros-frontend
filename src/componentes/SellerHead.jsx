import { initials } from '../utils/colors'
import { fmt } from '../utils/format'

const SellerHead = ({ tienda, publicados, ventas, vendido, onMiCuenta }) => {
  return (
    <div className="u-head card">
      <span className="uav ini" style={{ width: 84, height: 84, fontSize: 30 }}>{initials(tienda, 2).toUpperCase()}</span>
      <div className="u-id">
        <h1 className="fr">{tienda}</h1>
        <p>Vendedor verificado · {publicados} publicados · {ventas} ventas · {fmt(vendido)} vendido</p>
      </div>
      <button className="btn alt u-out" type="button" onClick={onMiCuenta}>Mi cuenta</button>
    </div>
  )
}

export default SellerHead
