import { useEffect, useRef, useState } from 'react'

// Cuántos lomos entran en el ancho de la estantería (~64px cada uno, mínimo 4)
const useShelfCount = (max) => {
  const ref = useRef(null)
  const [n, setN] = useState(4)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const calc = () => setN(Math.max(4, Math.min(max, Math.floor(el.clientWidth / 64))))
    calc()
    const ro = new ResizeObserver(calc)
    ro.observe(el)
    return () => ro.disconnect()
  }, [max])

  return [ref, n]
}

export default useShelfCount
