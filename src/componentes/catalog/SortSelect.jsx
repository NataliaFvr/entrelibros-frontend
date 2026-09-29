const OPCIONES = [['best', 'Bestsellers'], ['new', 'Más nuevos'], ['asc', 'Menor precio'], ['desc', 'Mayor precio'], ['disc', 'Mayor descuento']]

export default function SortSelect({ value, onChange }) {
  return (
    <div className="sortbox">
      <label htmlFor="sort">Ordenar por</label>
      <select id="sort" value={value} onChange={(e) => onChange(e.target.value)}>
        {OPCIONES.map(([v, etiqueta]) => <option key={v} value={v}>{etiqueta}</option>)}
      </select>
    </div>
  )
}
