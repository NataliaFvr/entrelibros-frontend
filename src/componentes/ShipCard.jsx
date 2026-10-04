// Tarjeta con el precio de un tipo de envío. `variante="d"` cambia el color del borde superior.
const ShipCard = ({ titulo, precio, variante = '', children }) => {
  return (
    <div className={`card ship-c ${variante}`.trim()}>
      <h3 className="fr">{titulo}</h3>
      <div className="pr">{precio}</div>
      <p>{children}</p>
    </div>
  )
}

export default ShipCard
