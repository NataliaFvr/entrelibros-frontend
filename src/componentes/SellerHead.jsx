import { fmt } from '../utils/format'
import Avatar from './Avatar'

const SellerHead = ({ tienda, publicados, ventas, vendido, user, perfil, onMiCuenta }) => {
  return (
    <div className="u-head card">
      <Avatar user={user} perfil={perfil} size={84} />
      <div className="u-id">
        <h1 className="fr">{tienda}</h1>
        <p>Vendedor verificado · {publicados} publicados · {ventas} ventas · {fmt(vendido)} vendido</p>
      </div>
      <button className="btn alt u-out" type="button" onClick={onMiCuenta}>Mi cuenta</button>
    </div>
  )
}

export default SellerHead
