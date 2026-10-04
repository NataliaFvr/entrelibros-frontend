import { useCallback, useEffect, useState } from 'react'

// Abrir/cerrar de un panel flotante. Con Escape se cierra.
const usePopover = () => {
  const [abierto, setAbierto] = useState(false)
  const cerrar = useCallback(() => setAbierto(false), [])
  const alternar = () => setAbierto((a) => !a)

  useEffect(() => {
    if (!abierto) return undefined
    const alTeclear = (e) => { if (e.key === 'Escape') cerrar() }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [abierto, cerrar])

  return { abierto, alternar, cerrar }
}

export default usePopover
