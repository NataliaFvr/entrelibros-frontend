import { useState } from 'react'

// Contraseña con botón Ver/Ocultar. `error` / `onBlur(name)`: igual que en Field.
const PasswordField = ({ label, name, value, onChange, onBlur, error, autoComplete }) => {
  const [visible, setVisible] = useState(false)
  const idError = error ? `${name}-error` : undefined
  return (
    <label className={`fld${error ? ' invalid' : ''}`}>
      {label}
      <span className="pw">
        <input
          type={visible ? 'text' : 'password'} name={name} value={value} autoComplete={autoComplete}
          onChange={(e) => onChange(name, e.target.value)} onBlur={() => onBlur && onBlur(name)}
          aria-invalid={error ? true : undefined} aria-describedby={idError}
        />
        <button className="eye" type="button" onClick={() => setVisible(!visible)}>{visible ? 'Ocultar' : 'Ver'}</button>
      </span>
      {error && <span className="fld-err" id={idError}>{error}</span>}
    </label>
  )
}

export default PasswordField
