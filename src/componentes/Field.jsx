// Campo de texto con etiqueta. `name` es la clave dentro del formulario; el resto de props van al input.
const Field = ({ label, name, value, onChange, type = 'text', autoComplete, ...extra }) => {
  return (
    <label className="fld">
      {label}
      <input type={type} name={name} value={value} autoComplete={autoComplete} onChange={(e) => onChange(name, e.target.value)} {...extra} />
    </label>
  )
}

export default Field
