// Selección de varias categorías (casillas en forma de "chips"). `value`: lista de nombres elegidos.
// El back guarda las categorías de un libro como un conjunto (sin orden ni "principal"): acá no se promete ninguna.
// `error` / `onBlur(name)`: igual que en Field. Solo la primera casilla lleva `name`, para que el formulario pueda enfocarla.
const CategoriasField = ({ name, value = [], onChange, onBlur, error, opciones }) => {
  const idError = error ? `${name}-error` : undefined
  const alternar = (c) => onChange(name, value.includes(c) ? value.filter((x) => x !== c) : [...value, c])
  return (
    <fieldset className={`fld catset${error ? ' invalid' : ''}`} aria-describedby={idError} onBlur={() => onBlur && onBlur(name)}>
      <legend>Categorías</legend>
      <div className="catchips">
        {opciones.map((c, i) => {
          const marcada = value.includes(c)
          return (
            <label key={c} className={`catchip${marcada ? ' on' : ''}`}>
              <input type="checkbox" name={i === 0 ? name : undefined} checked={marcada} onChange={() => alternar(c)} aria-invalid={error ? true : undefined} />
              {c}
            </label>
          )
        })}
      </div>
      <small className="iu-hint">Elegí una o más: el libro aparece en el catálogo de todas las que marques.</small>
      {error && <span className="fld-err" id={idError}>{error}</span>}
    </fieldset>
  )
}

export default CategoriasField
