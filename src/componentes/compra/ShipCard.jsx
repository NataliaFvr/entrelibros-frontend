// Tarjeta con el precio de un tipo de envío. `variante="d"` cambia el color del borde superior.
// `accion` (opcional): botón que va debajo del texto (el panel del administrador lo usa para cambiar el precio).
const ShipCard = ({ titulo, precio, variante = '', accion, children }) => {
  return (
    <div className={`card ship-c ${variante}`.trim()}>
      <h3 className="fr">{titulo}</h3>
      <div className="pr">{precio}</div>
      <p>{children}</p>
      {accion}
    </div>
  )
}

export default ShipCard
