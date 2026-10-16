import { useState } from 'react'
import { FORMATOS_IMAGEN } from '../utils/imagen'

// Fotos de un libro: agregar varias, recortar, quitar y reordenar.
// La primera es la portada; las demás forman el carrusel de la ficha.
// Cada archivo elegido pasa por el recortador (uno por vez, en cola) antes de sumarse a `fotos`.
const useImagenesLibro = (inicial = []) => {
  const [fotos, setFotos] = useState(inicial)
  const [cola, setCola] = useState([]) // archivos esperando su recorte
  const [reedicion, setReedicion] = useState(null) // índice de una foto ya cargada que se vuelve a recortar

  const elegir = (archivos) => {
    setCola((c) => [...c, ...Array.from(archivos)])
  }

  // Lo que el recortador tiene que mostrar ahora: un archivo nuevo o una foto ya cargada (solo las base64 se pueden re-recortar)
  const origenRecorte = reedicion !== null ? fotos[reedicion] : cola[0] ?? null
  const recorte = origenRecorte ? { origen: origenRecorte, ...FORMATOS_IMAGEN.libro, restantes: reedicion !== null ? 0 : cola.length - 1 } : null

  const confirmarRecorte = (dataUrl) => {
    if (reedicion !== null) {
      setFotos((f) => f.map((x, i) => (i === reedicion ? dataUrl : x)))
      setReedicion(null)
    } else {
      setFotos((f) => [...f, dataUrl])
      setCola((c) => c.slice(1))
    }
  }
  // Cancelar descarta solo la foto actual; las siguientes de la cola siguen
  const cancelarRecorte = () => (reedicion !== null ? setReedicion(null) : setCola((c) => c.slice(1)))

  const recortar = (i) => { if (fotos[i]?.startsWith('data:')) setReedicion(i) }
  const puedeRecortar = (i) => Boolean(fotos[i]?.startsWith('data:'))

  const quitar = (i) => setFotos((f) => f.filter((_, k) => k !== i))

  // Mueve la foto i una posición (-1 = antes, +1 = después)
  const mover = (i, paso) => setFotos((f) => {
    const j = i + paso
    if (j < 0 || j >= f.length) return f
    const copia = [...f]
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
    return copia
  })

  return { fotos, cargando: false, recorte, elegir, confirmarRecorte, cancelarRecorte, recortar, puedeRecortar, quitar, mover }
}

export default useImagenesLibro
