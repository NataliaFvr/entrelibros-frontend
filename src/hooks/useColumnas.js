import { useEffect, useRef, useState } from 'react'

// Cuántas columnas tiene la grilla en este momento. Se lee del propio CSS (grid-template-columns),
// así el número siempre coincide con lo que se ve, en cualquier ancho de pantalla.
const useColumnas = () => {
  const ref = useRef(null)
  const [columnas, setColumnas] = useState(4)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const calc = () => setColumnas(Math.max(2, getComputedStyle(el).gridTemplateColumns.split(' ').length))
    calc()
    const ro = new ResizeObserver(calc)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return [ref, columnas]
}

export default useColumnas
