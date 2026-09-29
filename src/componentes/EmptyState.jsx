const EmptyState = ({ onLimpiar }) => {
  return (
    <div className="empty">
      <h3>No encontramos libros con esos filtros</h3>
      <p>Probá quitar alguno o ampliar el rango de precio.</p>
      <button type="button" onClick={onLimpiar}>Limpiar filtros</button>
    </div>
  )
}

export default EmptyState
