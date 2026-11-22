// Rango de precio: dos sliders + dos inputs numéricos. `onChange(min, max)`.
const PriceFilter = ({ min, max, minimo = 0, maximo = 500, onChange }) => {
  const cambiar = (lo, hi, desde) => {
    lo = Math.max(minimo, Math.min(maximo, Number.isNaN(lo) ? minimo : lo))
    hi = Math.max(minimo, Math.min(maximo, Number.isNaN(hi) ? maximo : hi))
    if (lo > hi) { if (desde === 'min') hi = lo; else lo = hi }
    onChange(lo, hi)
  }
  const num = (v, vacio) => (v === '' ? vacio : +v)

  return (
    <div className="fbox">
      <h3>Precio</h3>
      <div className="dual">
        <div className="track" />
        <div className="fill" style={{ left: `${((min - minimo) / (maximo - minimo || 1)) * 100}%`, right: `${100 - ((max - minimo) / (maximo - minimo || 1)) * 100}%` }} />
        <input type="range" min={minimo} max={maximo} step="1" value={min} aria-label="Precio mínimo"
          onChange={(e) => cambiar(+e.target.value, max, 'min')} />
        <input type="range" min={minimo} max={maximo} step="1" value={max} aria-label="Precio máximo"
          onChange={(e) => cambiar(min, +e.target.value, 'max')} />
      </div>
      <div className="prices">
        <label>Mínimo
          <input type="number" min={minimo} max={maximo} step="1" placeholder={`$ ${minimo}`} value={min > minimo ? min : ''}
            onChange={(e) => cambiar(num(e.target.value, minimo), max, 'min')} />
        </label>
        <label>Máximo
          <input type="number" min={minimo} max={maximo} step="1" placeholder={`$ ${maximo}`} value={max < maximo ? max : ''}
            onChange={(e) => cambiar(min, num(e.target.value, maximo), 'max')} />
        </label>
      </div>
    </div>
  )
}

export default PriceFilter
