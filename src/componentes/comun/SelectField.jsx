// Desplegable con etiqueta. `opciones`: array de strings o de [valor, etiqueta].
// `error` / `onBlur(name)`: igual que en Field.
const SelectField = ({ label, name, value, onChange, onBlur, error, opciones, className = '' }) => {
  const idError = error ? `${name}-error` : undefined
  return (
    <label className={`fld ${className}${error ? ' invalid' : ''}`.trim()}>
      {label}
      <select
        className="fsel" name={name} value={value} onChange={(e) => onChange(name, e.target.value)} onBlur={() => onBlur && onBlur(name)}
        aria-invalid={error ? true : undefined} aria-describedby={idError}
      >
        {opciones.map((o) => {
          const [v, etiqueta] = Array.isArray(o) ? o : [o, o]
          return <option key={v} value={v}>{etiqueta}</option>
        })}
      </select>
      {error && <span className="fld-err" id={idError}>{error}</span>}
    </label>
  )
}

export default SelectField
