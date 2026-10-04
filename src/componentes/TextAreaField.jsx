// Área de texto con etiqueta. Misma firma que Field: `onChange(name, valor)`.
const TextAreaField = ({ label, name, value, onChange, ...extra }) => {
  return (
    <label className="fld">
      {label}
      <textarea name={name} value={value} onChange={(e) => onChange(name, e.target.value)} {...extra} />
    </label>
  )
}

export default TextAreaField
