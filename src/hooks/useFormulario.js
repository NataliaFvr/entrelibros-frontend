import { useState } from 'react'

// Estado de un formulario simple: valores + mensaje de error
const useFormulario = (inicial) => {
  const [valores, setValores] = useState(inicial)
  const [error, setError] = useState('')
  const cambiar = (nombre, valor) => setValores((v) => ({ ...v, [nombre]: valor }))
  return { valores, cambiar, error, setError }
}

export default useFormulario
