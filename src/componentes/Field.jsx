// Campo de texto con etiqueta. `name` es la clave dentro del formulario; el resto de props van al input.
// `error`: mensaje de validación (pinta el campo en rojo y lo muestra debajo). `onBlur(name)`: al salir del campo.
const Field = ({ label, name, value, onChange, onBlur, error, type = 'text', autoComplete, ...extra }) => {
  const idError = error ? `${name}-error` : undefined
  return (
    <label className={`fld${error ? ' invalid' : ''}`}>
      {label}
      <input
        type={type} name={name} value={value} autoComplete={autoComplete}
        onChange={(e) => onChange(name, e.target.value)} onBlur={() => onBlur && onBlur(name)}
        aria-invalid={error ? true : undefined} aria-describedby={idError} {...extra}
      />
      {error && <span className="fld-err" id={idError}>{error}</span>}
    </label>
  )
}

export default Field
