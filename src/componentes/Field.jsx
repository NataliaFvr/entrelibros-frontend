// Campo de texto con etiqueta. `name` es la clave dentro del formulario.
const Field = ({ label, name, value, onChange, type = 'text', autoComplete }) => {
  return (
    <label className="fld">
      {label}
      <input type={type} name={name} value={value} autoComplete={autoComplete} onChange={(e) => onChange(name, e.target.value)} />
    </label>
  )
}

export default Field
