import { esUsado } from '../utils/libro'

const BuyBox = ({ libro, stock, onComprar, onCarrito }) => {
  // Un usado es una pieza única: ahí no corresponde la alerta de "¡Última unidad!"
  const ultima = stock === 1 && !esUsado(libro)
  return (
    <div className="buy">
      <div className={`stk${ultima ? ' last' : ''}`}>{ultima ? '¡Última unidad!' : 'Stock disponible'}</div>
      {stock > 1 && <small className="sv-meta">{stock > 10 ? '+10' : stock} disponibles</small>}
      <div className="ship">
        <b>{libro.envio === 'misma' ? 'Vendedor en tu misma provincia' : 'Vendedor en otra provincia'}</b>
        <small>El costo y el plazo de envío se calculan al finalizar la compra.</small>
      </div>
      <button className="btn main" type="button" onClick={onComprar}>Comprar ahora</button>
      <button className="btn alt" type="button" onClick={onCarrito}>Añadir a mi estantería</button>
    </div>
  )
}

export default BuyBox
