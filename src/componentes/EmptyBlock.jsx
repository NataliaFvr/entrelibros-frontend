// Bloque "no hay nada todavía", con botón opcional
const EmptyBlock = ({ titulo, texto, boton, onClick }) => {
  return (
    <div className="empty">
      <h3>{titulo}</h3>
      <p>{texto}</p>
      {boton && <button type="button" onClick={onClick}>{boton}</button>}
    </div>
  )
}

export default EmptyBlock
