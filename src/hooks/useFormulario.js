import { useState } from 'react'

// Estado de un formulario simple: valores + mensaje de error
const useFormulario = (inicial) => {
  const [valores, setValores] = useState(inicial)
  const [error, setError] = useState('')
  const cambiar = (nombre, valor) => setValores((v) => ({ ...v, [nombre]: valor }))
  const completar = (datos) => setValores((v) => ({ ...v, ...datos }))
  const reiniciar = () => { setValores(inicial); setError('') }
  return { valores, cambiar, completar, error, setError, reiniciar }
}

export default useFormulario
