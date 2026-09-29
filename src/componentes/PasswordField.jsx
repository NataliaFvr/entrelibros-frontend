import { useState } from 'react'

const PasswordField = ({ label, name, value, onChange, autoComplete }) => {
  const [visible, setVisible] = useState(false)
  return (
    <label className="fld">
      {label}
      <span className="pw">
        <input type={visible ? 'text' : 'password'} name={name} value={value} autoComplete={autoComplete} onChange={(e) => onChange(name, e.target.value)} />
        <button className="eye" type="button" onClick={() => setVisible(!visible)}>{visible ? 'Ocultar' : 'Ver'}</button>
      </span>
    </label>
  )
}

export default PasswordField
