// Catálogo sin resultados. Con `error` (falló la carga del catálogo) NO dice "no encontramos libros": ofrece reintentar.
const EmptyState = ({ onLimpiar, error = false, onReintentar }) => {
  if (error) {
    return (
      <div className="empty" role="alert">
        <h3>No pudimos cargar los libros</h3>
        <p>Hubo un problema al consultar el catálogo. Revisá el aviso e intentá de nuevo.</p>
        <button type="button" onClick={onReintentar}>Reintentar</button>
      </div>
    )
  }
  return (
    <div className="empty">
      <h3>No encontramos libros con esos filtros</h3>
      <p>Probá quitar alguno o ampliar el rango de precio.</p>
      <button type="button" onClick={onLimpiar}>Limpiar filtros</button>
    </div>
  )
}

export default EmptyState
