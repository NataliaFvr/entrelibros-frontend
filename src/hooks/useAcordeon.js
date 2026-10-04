import { useState } from 'react'

// Acordeón de un solo ítem abierto a la vez. `inicial` = id abierto al entrar (o null).
// Tocar el ítem abierto lo cierra.
const useAcordeon = (inicial = null) => {
  const [abierto, setAbierto] = useState(inicial)
  const alternar = (id) => setAbierto((actual) => (actual === id ? null : id))
  return { abierto, alternar }
}

export default useAcordeon
