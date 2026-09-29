import { PRECIO_MAX } from '../utils/filtrarLibros'
import { fmt } from '../utils/format'

// Arma la lista [{ key, texto, quitar }] a partir de los filtros activos
const armarChips = (f, set, toggle) => {
  const c = []
  const add = (key, texto, quitar) => c.push({ key, texto, quitar })

  if (f.q) add('q', `Búsqueda: “${f.q}”`, () => set({ q: '' }))
  if (f.estado !== 'ambos') add('estado', `Estado: ${f.estado}`, () => set({ estado: 'ambos' }))
  f.cats.forEach((x) => add(`cat-${x}`, x, () => toggle('cats', x)))
  f.envios.forEach((x) => add(`env-${x}`, x === 'misma' ? 'Misma provincia' : 'Provincia distinta', () => toggle('envios', x)))
  if (f.min > 0 || f.max < PRECIO_MAX) add('precio', `${fmt(f.min)} – ${fmt(f.max)}`, () => set({ min: 0, max: PRECIO_MAX }))
  if (f.desc) add('desc', f.desc === 1 ? 'Con descuento' : `${f.desc}% o más`, () => set({ desc: 0 }))
  ;[['ed', 'Editorial'], ['autor', 'Autor'], ['idioma', 'Idioma'], ['vendedor', 'Vendedor']].forEach(([k, n]) => {
    if (f[k]) add(k, `${n}: ${f[k]}`, () => set({ [k]: '' }))
  })
  if (f.anio !== '') add('anio', `Año: ${f.anio === '0' ? 'antes del 2000' : `${f.anio} o después`}`, () => set({ anio: '' }))
  return c
}

const ActiveChips = ({ f, set, toggle, onLimpiar }) => {
  const chips = armarChips(f, set, toggle)
  return (
    <div className="chips">
      {chips.map((c) => (
        <button key={c.key} className="chip" type="button" onClick={c.quitar}>{c.texto} ✕</button>
      ))}
      {chips.length > 1 && <button className="chip clear" type="button" onClick={onLimpiar}>Limpiar filtros</button>}
    </div>
  )
}

export default ActiveChips
