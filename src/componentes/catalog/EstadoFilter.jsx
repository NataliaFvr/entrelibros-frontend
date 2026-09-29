const OPCIONES = [['ambos', 'Ambos'], ['nuevos', 'Nuevos'], ['usados', 'Usados']]

export default function EstadoFilter({ value, onChange }) {
  return (
    <div className="fbox">
      <h3>Estado</h3>
      <div className="seg">
        {OPCIONES.map(([v, etiqueta]) => (
          <label key={v}>
            <input type="radio" name="estado" value={v} checked={value === v} onChange={() => onChange(v)} />
            <span>{etiqueta}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
