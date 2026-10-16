import { esUsado } from '../utils/libro'

// `soloLectura`: administrador mirando la ficha -> sin botones de compra
const BuyBox = ({ libro, stock, onComprar, onCarrito, soloLectura = false }) => {
  // Un usado es una pieza única: ahí no corresponde la alerta de "¡Última unidad!"
  const ultima = stock === 1 && !esUsado(libro)
  return (
    <div className="buy">
      <div className={`stk${ultima ? ' last' : ''}`}>{ultima ? '¡Última unidad!' : 'Stock disponible'}</div>
      {stock > 1 && <small className="sv-meta">{stock > 10 ? '+10' : stock} disponibles</small>}
      {soloLectura ? (
        <small className="sv-meta">Vista de administración: la compra y el Marcapáginas están desactivados.</small>
      ) : (
        <>
          <div className="ship">
            <b>{libro.provV ? `Vendedor en ${libro.provV}` : 'Provincia del vendedor no informada'}</b>
            <small>El costo y el plazo de envío se calculan al finalizar la compra.</small>
          </div>
          <button className="btn main" type="button" onClick={onComprar}>Comprar ahora</button>
          <button className="btn alt" type="button" onClick={onCarrito}>Añadir a mi estantería</button>
        </>
      )}
    </div>
  )
}

export default BuyBox
