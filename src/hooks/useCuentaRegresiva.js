import { useEffect, useState } from 'react'

// Segundos que faltan (baja sola). `reiniciar()` vuelve a empezar.
const useCuentaRegresiva = (segundos) => {
  const [fin, setFin] = useState(() => Date.now() + segundos * 1000)
  const [ahora, setAhora] = useState(() => Date.now())

  useEffect(() => {
    const t = setInterval(() => setAhora(Date.now()), 500)
    return () => clearInterval(t)
  }, [])

  const reiniciar = () => {
    setFin(Date.now() + segundos * 1000)
    setAhora(Date.now())
  }

  return [Math.max(0, Math.ceil((fin - ahora) / 1000)), reiniciar]
}

export default useCuentaRegresiva
