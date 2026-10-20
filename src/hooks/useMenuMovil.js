import { useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'

// Estado del menú hamburguesa. Se cierra solo al navegar o con Escape (`alTeclear` va en el onKeyDown del header).
// El scroll de la página de atrás lo traba el CSS mientras el menú está abierto (solo en pantallas chicas).
const useMenuMovil = () => {
  const { key } = useLocation()
  // Guardamos en qué navegación se abrió: si la ruta cambia, ya no coincide y queda cerrado
  const [abiertoEn, setAbiertoEn] = useState(null)
  const abierto = abiertoEn === key

  const cerrar = useCallback(() => setAbiertoEn(null), [])
  const alternar = () => setAbiertoEn(abierto ? null : key)
  const alTeclear = (e) => { if (abierto && e.key === 'Escape') cerrar() }

  return { abierto, alternar, cerrar, alTeclear }
}

export default useMenuMovil
