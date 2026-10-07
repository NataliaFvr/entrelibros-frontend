import useCarruselScroll from '../hooks/useCarruselScroll'

// Cola de moderación en carrusel horizontal: una solicitud por vez, de la más antigua a la más reciente.
// `renderItem(solicitud)` dibuja cada tarjeta (con sus botones Aprobar / Rechazar).
const CarruselModeracion = ({ items, renderItem, etiqueta }) => {
  const total = items.length
  const { pista, indice, ir, alScroll, alTeclear } = useCarruselScroll(total)

  return (
    <section className="mcar" aria-roledescription="carrusel" aria-label={etiqueta}>
      <div className="mcar-bar">
        <p className="mcar-count" role="status">
          Solicitud {indice + 1} de {total}
          <small> · de la más antigua a la más reciente</small>
        </p>
        <div className="mcar-nav">
          <button className="mcar-btn" type="button" aria-label="Solicitud anterior" disabled={indice === 0} onClick={() => ir(indice - 1)}>‹</button>
          <button className="mcar-btn" type="button" aria-label="Solicitud siguiente" disabled={indice >= total - 1} onClick={() => ir(indice + 1)}>›</button>
        </div>
      </div>
      <div className="mcar-pista" ref={pista} tabIndex={0} aria-label={`${etiqueta}: deslizá o usá las flechas ← →`} onScroll={alScroll} onKeyDown={alTeclear}>
        {items.map((s, i) => (
          <div key={s.id} className="mcar-slide" role="group" aria-roledescription="diapositiva" aria-label={`${i + 1} de ${total}`}>
            {renderItem(s)}
          </div>
        ))}
      </div>
    </section>
  )
}

export default CarruselModeracion
