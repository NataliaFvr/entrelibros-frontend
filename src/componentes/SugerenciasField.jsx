import { useId, useState } from 'react'
import { canonico, filtrarSugerencias } from '../utils/sugerencias'

// Campo de texto con sugerencias (lista desplegable) tomadas de lo que ya existe en el catálogo.
// - `sugerencias`: [{ nombre, total }] (ver valoresFrecuentes). Se puede escribir cualquier valor: son solo sugerencias.
// - `minimo`: letras que hay que escribir antes de mostrarlas (0 = se ven apenas se enfoca el campo).
// - `maximo`: cuántas se muestran como mucho.
// Al salir del campo, si lo escrito es igual a una existente (sin mirar mayúsculas ni tildes) se corrige a esa grafía.
// Teclado: ↑ ↓ para recorrer, Enter para elegir, Esc para cerrar. `error` / `onBlur(name)`: igual que en Field.
const SugerenciasField = ({ label, name, value, onChange, onBlur, error, sugerencias = [], minimo = 0, maximo = 6, ...extra }) => {
  const id = useId()
  const idLista = `${id}-lista`
  const idError = error ? `${name}-error` : undefined
  const [abierta, setAbierta] = useState(false)
  const [activa, setActiva] = useState(-1)

  const opciones = filtrarSugerencias(sugerencias, value, { minimo, maximo })
  const visible = abierta && opciones.length > 0

  const elegir = (nombre) => {
    onChange(name, nombre)
    setAbierta(false)
    setActiva(-1)
  }

  const alTeclear = (e) => {
    if (e.key === 'Escape') { if (visible) { e.preventDefault(); setAbierta(false) } return }
    if (!opciones.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setAbierta(true); setActiva((a) => (a + 1) % opciones.length) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setAbierta(true); setActiva((a) => (a <= 0 ? opciones.length - 1 : a - 1)) }
    else if (e.key === 'Enter' && visible && activa >= 0) { e.preventDefault(); elegir(opciones[activa].nombre) }
  }

  const alSalir = () => {
    setAbierta(false)
    setActiva(-1)
    const corregido = canonico(sugerencias, value)
    if (corregido !== value) onChange(name, corregido)
    if (onBlur) onBlur(name)
  }

  return (
    <div className={`fld sug${error ? ' invalid' : ''}`}>
      <label htmlFor={`${id}-campo`}>{label}</label>
      <div className="sug-box">
        <input
          id={`${id}-campo`} type="text" name={name} value={value} autoComplete="off"
          role="combobox" aria-expanded={visible} aria-controls={idLista} aria-autocomplete="list"
          aria-activedescendant={visible && activa >= 0 ? `${id}-op-${activa}` : undefined}
          aria-invalid={error ? true : undefined} aria-describedby={idError}
          onChange={(e) => { onChange(name, e.target.value); setAbierta(true); setActiva(-1) }}
          onFocus={() => setAbierta(true)} onBlur={alSalir} onKeyDown={alTeclear} {...extra}
        />
        {visible && (
          <ul className="sug-list" id={idLista} role="listbox" aria-label={`Sugerencias de ${label.toLowerCase()}`}>
            {opciones.map((o, i) => (
              // onMouseDown (y no onClick): se elige antes de que el campo pierda el foco y cierre la lista
              <li key={o.nombre} id={`${id}-op-${i}`} role="option" aria-selected={i === activa}
                onMouseDown={(e) => { e.preventDefault(); elegir(o.nombre) }} onMouseEnter={() => setActiva(i)}>
                {o.nombre}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <span className="fld-err" id={idError}>{error}</span>}
    </div>
  )
}

export default SugerenciasField
