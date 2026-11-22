// Bloque "no hay nada todavía", con botón opcional.
// tipo="error" lo usa quien no pudo cargar la lista (fallo de red o de servidor): se anuncia como alerta y NO es un estado vacío.
const EmptyBlock = ({ titulo, texto, boton, onClick, tipo = 'vacio' }) => {
  return (
    <div className="empty" role={tipo === 'error' ? 'alert' : undefined}>
      <h3>{titulo}</h3>
      <p>{texto}</p>
      {boton && <button type="button" onClick={onClick}>{boton}</button>}
    </div>
  )
}

export default EmptyBlock
