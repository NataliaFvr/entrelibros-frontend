import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// Vuelve arriba al cambiar de página (no al cambiar solo los filtros del catálogo).
// Usa una marca invisible al principio de la página y la trae a la vista (ref de React, sin window).
const ScrollToTop = () => {
  const { pathname } = useLocation()
  const marca = useRef(null)
  useEffect(() => { marca.current?.scrollIntoView({ block: 'start' }) }, [pathname])
  return <span ref={marca} className="scroll-top" aria-hidden="true" />
}

export default ScrollToTop
