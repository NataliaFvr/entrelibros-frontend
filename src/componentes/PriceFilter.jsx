import { PRECIO_MAX } from '../utils/filtrarLibros'

// Rango de precio: dos sliders + dos inputs numéricos. `onChange(min, max)`.
const PriceFilter = ({ min, max, onChange }) => {
  const cambiar = (lo, hi, desde) => {
    lo = Math.max(0, Math.min(PRECIO_MAX, Number.isNaN(lo) ? 0 : lo))
    hi = Math.max(0, Math.min(PRECIO_MAX, Number.isNaN(hi) ? PRECIO_MAX : hi))
    if (lo > hi) { if (desde === 'min') hi = lo; else lo = hi }
    onChange(lo, hi)
  }
  const num = (v, vacio) => (v === '' ? vacio : +v)

  return (
    <div className="fbox">
      <h3>Precio</h3>
      <div className="dual">
        <div className="track" />
        <div className="fill" style={{ left: `${(min / PRECIO_MAX) * 100}%`, right: `${100 - (max / PRECIO_MAX) * 100}%` }} />
        <input type="range" min="0" max={PRECIO_MAX} step="10" value={min} aria-label="Precio mínimo"
          onChange={(e) => cambiar(+e.target.value, max, 'min')} />
        <input type="range" min="0" max={PRECIO_MAX} step="10" value={max} aria-label="Precio máximo"
          onChange={(e) => cambiar(min, +e.target.value, 'max')} />
      </div>
      <div className="prices">
        <label>Mínimo
          <input type="number" min="0" max={PRECIO_MAX} step="10" placeholder="$ 0" value={min > 0 ? min : ''}
            onChange={(e) => cambiar(num(e.target.value, 0), max, 'min')} />
        </label>
        <label>Máximo
          <input type="number" min="0" max={PRECIO_MAX} step="10" placeholder={`$ ${PRECIO_MAX}`} value={max < PRECIO_MAX ? max : ''}
            onChange={(e) => cambiar(min, num(e.target.value, PRECIO_MAX), 'max')} />
        </label>
      </div>
    </div>
  )
}

export default PriceFilter
