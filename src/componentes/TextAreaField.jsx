// Área de texto con etiqueta. Misma firma que Field: `onChange(name, valor)`, `onBlur(name)` y `error`.
// `max` muestra un contador de caracteres.
const TextAreaField = ({ label, name, value, onChange, onBlur, error, max, ...extra }) => {
  const idError = error ? `${name}-error` : undefined
  return (
    <label className={`fld${error ? ' invalid' : ''}`}>
      {label}
      <textarea
        name={name} value={value} maxLength={max} onChange={(e) => onChange(name, e.target.value)} onBlur={() => onBlur && onBlur(name)}
        aria-invalid={error ? true : undefined} aria-describedby={idError} {...extra}
      />
      {max && <small className="fld-count" aria-hidden="true">{String(value).length}/{max}</small>}
      {error && <span className="fld-err" id={idError}>{error}</span>}
    </label>
  )
}

export default TextAreaField
