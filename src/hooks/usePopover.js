import { useCallback, useState } from 'react'

// Abrir/cerrar de un panel flotante. `alTeclear` va en el onKeyDown del contenedor: con Escape se cierra.
const usePopover = () => {
  const [abierto, setAbierto] = useState(false)
  const cerrar = useCallback(() => setAbierto(false), [])
  const alternar = () => setAbierto((a) => !a)
  const alTeclear = (e) => { if (abierto && e.key === 'Escape') cerrar() }

  return { abierto, alternar, cerrar, alTeclear }
}

export default usePopover
