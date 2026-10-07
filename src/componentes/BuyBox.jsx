import { esUsado } from '../utils/libro'

// `soloLectura`: administrador mirando la ficha -> sin botones de compra
// `propio`: es una publicación de quien mira la ficha -> en lugar de comprar, puede editarla
const BuyBox = ({ libro, stock, onComprar, onCarrito, propio = false, soloLectura = false, onEditar, editarDeshabilitado = false }) => {
  // Un usado es una pieza única: ahí no corresponde la alerta de "¡Última unidad!"
  const ultima = stock === 1 && !esUsado(libro)
  return (
    <div className="buy">
      <div className={`stk${ultima ? ' last' : ''}`}>{ultima ? '¡Última unidad!' : 'Stock disponible'}</div>
      {stock > 1 && <small className="sv-meta">{stock > 10 ? '+10' : stock} disponibles</small>}
      {soloLectura ? (
        <small className="sv-meta">Vista de administración: la compra y el Marcapáginas están desactivados.</small>
      ) : propio ? (
        <>
          <small className="sv-meta">Esta publicación es tuya, por eso no podés comprarla ni guardarla.</small>
          {editarDeshabilitado && <small className="sv-meta">Tenés una modificación en revisión. Podrás editar de nuevo cuando un administrador la resuelva.</small>}
          <button className="btn main" type="button" onClick={onEditar} disabled={editarDeshabilitado}>Editar mi publicación</button>
        </>
      ) : (
        <>
          <div className="ship">
            <b>{libro.envio === 'misma' ? 'Vendedor en tu misma provincia' : 'Vendedor en otra provincia'}</b>
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
