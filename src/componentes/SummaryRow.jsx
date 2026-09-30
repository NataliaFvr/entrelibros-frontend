// Fila del resumen. Con `detalle` muestra título en negrita + detalle chico; `total` la resalta.
const SummaryRow = ({ titulo, detalle, valor, total }) => {
  return (
    <div className={`sl${total ? ' tot' : ''}`}>
      <span>{detalle ? <><b>{titulo}</b><small>{detalle}</small></> : titulo}</span>
      <span>{valor}</span>
    </div>
  )
}

export default SummaryRow
