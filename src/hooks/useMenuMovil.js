import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

// Mismo corte que el @media (max-width:1023px) de "HEADER RESPONSIVE" en index.css
const ESCRITORIO = '(min-width: 1024px)'

// Estado del menú hamburguesa. Se cierra solo al navegar, con Escape o al agrandar la ventana.
const useMenuMovil = () => {
  const { key } = useLocation()
  // Guardamos en qué navegación se abrió: si la ruta cambia, ya no coincide y queda cerrado
  const [abiertoEn, setAbiertoEn] = useState(null)
  const abierto = abiertoEn === key

  const cerrar = useCallback(() => setAbiertoEn(null), [])
  const alternar = () => setAbiertoEn(abierto ? null : key)

  useEffect(() => {
    if (!abierto) return
    const alTeclear = (e) => { if (e.key === 'Escape') cerrar() }
    const mq = window.matchMedia(ESCRITORIO)
    const alCambiar = (e) => { if (e.matches) cerrar() }
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden' // la página de atrás no se mueve mientras el menú está abierto
    window.addEventListener('keydown', alTeclear)
    mq.addEventListener('change', alCambiar)
    return () => {
      document.body.style.overflow = overflowPrevio
      window.removeEventListener('keydown', alTeclear)
      mq.removeEventListener('change', alCambiar)
    }
  }, [abierto, cerrar])

  return { abierto, alternar, cerrar }
}

export default useMenuMovil
