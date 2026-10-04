import { useRef, useState } from 'react'

const UMBRAL = 40 // px mínimos de arrastre horizontal para contar como deslizar

// Carrusel de `total` elementos: botones, teclado (← →) y deslizar con el dedo. Da la vuelta al llegar al final.
const useCarrusel = (total) => {
  const [indice, setIndice] = useState(0)
  const inicioX = useRef(null)

  const ir = (i) => setIndice(((i % total) + total) % total)
  const siguiente = () => ir(indice + 1)
  const anterior = () => ir(indice - 1)

  const gestos = {
    onKeyDown: (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); siguiente() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); anterior() }
    },
    onTouchStart: (e) => { inicioX.current = e.touches[0].clientX },
    onTouchEnd: (e) => {
      if (inicioX.current === null) return
      const dx = e.changedTouches[0].clientX - inicioX.current
      inicioX.current = null
      if (Math.abs(dx) >= UMBRAL) (dx < 0 ? siguiente : anterior)()
    },
  }

  return { indice: Math.min(indice, total - 1), ir, siguiente, anterior, gestos }
}

export default useCarrusel
