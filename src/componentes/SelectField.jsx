// Desplegable con etiqueta. `opciones`: array de strings o de [valor, etiqueta].
const SelectField = ({ label, name, value, onChange, opciones, className = '' }) => {
  return (
    <label className={`fld ${className}`.trim()}>
      {label}
      <select className="fsel" name={name} value={value} onChange={(e) => onChange(name, e.target.value)}>
        {opciones.map((o) => {
          const [v, etiqueta] = Array.isArray(o) ? o : [o, o]
          return <option key={v} value={v}>{etiqueta}</option>
        })}
      </select>
    </label>
  )
}

export default SelectField
