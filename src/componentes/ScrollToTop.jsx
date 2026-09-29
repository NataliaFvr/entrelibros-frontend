import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Vuelve arriba al cambiar de página (no al cambiar solo los filtros del catálogo)
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default ScrollToTop
