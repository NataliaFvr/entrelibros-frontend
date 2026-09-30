import { useEffect, useState } from 'react'

// Hora actual (ms), se actualiza sola cada `cada` ms. Sirve para cuentas regresivas.
const useAhora = (cada = 1000) => {
  const [ahora, setAhora] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setAhora(Date.now()), cada)
    return () => clearInterval(t)
  }, [cada])
  return ahora
}

export default useAhora
