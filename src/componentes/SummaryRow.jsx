// Fila del resumen. Con `detalle` muestra título en negrita + detalle chico; `total` la resalta.
// Con `miniatura` (URL) muestra la foto del libro en chico a la izquierda.
const SummaryRow = ({ titulo, detalle, valor, total, miniatura }) => {
  const texto = detalle ? <><b>{titulo}</b><small>{detalle}</small></> : titulo
  return (
    <div className={`sl${total ? ' tot' : ''}`}>
      {miniatura
        ? (
          <span className="sl-con-foto">
            <img className="sl-foto" src={miniatura} alt="" loading="lazy" />
            <span>{texto}</span>
          </span>
        )
        : <span>{texto}</span>}
      <span>{valor}</span>
    </div>
  )
}

export default SummaryRow
