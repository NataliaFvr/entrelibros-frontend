import { useState } from 'react'
import { esUsado } from '../utils/libro'

// `soloLectura`: administrador mirando la ficha -> sin botones de compra
const BuyBox = ({ libro, stock, onComprar, onCarrito, soloLectura = false }) => {
  // Un usado es una pieza única: ahí no corresponde la alerta de "¡Última unidad!"
  const ultima = stock === 1 && !esUsado(libro)
  // Cantidad a comprar: solo para libros nuevos con más de una unidad (un usado es una pieza única)
  const [cantidad, setCantidad] = useState(1)
  const elegible = !esUsado(libro) && stock > 1
  if (stock <= 0) {
    return (
      <div className="buy">
        <div className="stk last">Sin stock</div>
        <small className="sv-meta">Este libro se agotó. Guardalo en tu Marcapáginas para encontrarlo cuando vuelva.</small>
      </div>
    )
  }
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
          {elegible && (
            <div className="buy-q">
              <span>Cantidad</span>
              <div className="qty">
                <button type="button" aria-label="Menos" onClick={() => setCantidad(cantidad - 1)} disabled={cantidad <= 1}>−</button>
                <span>{cantidad}</span>
                <button type="button" aria-label="Más" onClick={() => setCantidad(cantidad + 1)} disabled={cantidad >= stock}>+</button>
              </div>
            </div>
          )}
          <button className="btn main" type="button" onClick={() => onComprar(cantidad)}>Comprar ahora</button>
          <button className="btn alt" type="button" onClick={() => onCarrito(cantidad)}>Añadir a mi estantería</button>
        </>
      )}
    </div>
  )
}

export default BuyBox
