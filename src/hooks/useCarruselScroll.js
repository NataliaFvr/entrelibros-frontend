import { useCallback, useEffect, useRef, useState } from 'react'

// Carrusel horizontal con scroll nativo y snap (CSS): sirve el dedo, el trackpad, la rueda con Shift y las flechas.
// Este hook solo sabe qué diapositiva está a la vista y cómo llevar a otra. No da la vuelta: al llegar al final se frena.
const useCarruselScroll = (total) => {
  const pista = useRef(null)
  const cuadro = useRef(0)
  const [visto, setVisto] = useState(0)

  const leer = useCallback(() => {
    const el = pista.current
    if (!el) return
    let mejor = 0
    let distancia = Infinity
    Array.from(el.children).forEach((h, i) => {
      const d = Math.abs(h.offsetLeft - el.scrollLeft)
      if (d < distancia) { distancia = d; mejor = i }
    })
    setVisto(mejor)
  }, [])

  // Una lectura por cuadro de animación, aunque el scroll dispare muchos eventos
  const alScroll = useCallback(() => {
    cancelAnimationFrame(cuadro.current)
    cuadro.current = requestAnimationFrame(leer)
  }, [leer])

  useEffect(() => () => cancelAnimationFrame(cuadro.current), [])

  const indice = Math.min(visto, Math.max(total - 1, 0)) // si se resuelve la última, queda la anterior

  const ir = (i) => {
    const el = pista.current
    const destino = el && el.children[i]
    if (!destino) return
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: destino.offsetLeft, behavior: reducir ? 'auto' : 'smooth' })
  }

  const alTeclear = (e) => {
    if (e.target !== e.currentTarget) return // las flechas dentro de un campo de texto no mueven el carrusel
    if (e.key === 'ArrowRight') { e.preventDefault(); ir(indice + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); ir(indice - 1) }
  }

  return { pista, indice, ir, alScroll, alTeclear }
}

export default useCarruselScroll
