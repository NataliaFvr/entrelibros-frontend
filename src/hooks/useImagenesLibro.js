import { useState } from 'react'
import { FORMATOS_IMAGEN, MAX_FOTOS, validarArchivoImagen } from '../utils/imagen'

// Fotos de un libro (base64) con su lista de errores: agregar varias, recortar, quitar y reordenar.
// La primera es la portada; las demás forman el carrusel de la ficha.
// Cada archivo elegido pasa por el recortador (uno por vez, en cola) antes de sumarse a `fotos`.
const useImagenesLibro = (inicial = []) => {
  const [fotos, setFotos] = useState(inicial)
  const [errores, setErrores] = useState([])
  const [cola, setCola] = useState([]) // archivos esperando su recorte
  const [reedicion, setReedicion] = useState(null) // índice de una foto ya cargada que se vuelve a recortar

  const elegir = (archivos) => {
    const faltas = []
    const validos = []
    let lugar = MAX_FOTOS - fotos.length - cola.length
    for (const archivo of archivos) {
      if (lugar <= 0) { faltas.push(`Máximo ${MAX_FOTOS} fotos por libro.`); break }
      const falta = validarArchivoImagen(archivo)
      if (falta) { faltas.push(falta); continue }
      validos.push(archivo)
      lugar -= 1
    }
    setCola((c) => [...c, ...validos])
    setErrores(faltas)
  }

  // Lo que el recortador tiene que mostrar ahora: un archivo nuevo o una foto ya cargada (solo las base64 se pueden re-recortar)
  const origenRecorte = reedicion !== null ? fotos[reedicion] : cola[0] ?? null
  const recorte = origenRecorte ? { origen: origenRecorte, ...FORMATOS_IMAGEN.libro, restantes: reedicion !== null ? 0 : cola.length - 1 } : null

  const confirmarRecorte = (dataUrl) => {
    if (reedicion !== null) {
      setFotos((f) => f.map((x, i) => (i === reedicion ? dataUrl : x)))
      setReedicion(null)
    } else {
      setFotos((f) => [...f, dataUrl].slice(0, MAX_FOTOS))
      setCola((c) => c.slice(1))
    }
  }
  // Cancelar descarta solo la foto actual; las siguientes de la cola siguen
  const cancelarRecorte = () => (reedicion !== null ? setReedicion(null) : setCola((c) => c.slice(1)))

  const recortar = (i) => { if (fotos[i]?.startsWith('data:')) setReedicion(i) }
  const puedeRecortar = (i) => Boolean(fotos[i]?.startsWith('data:'))

  const quitar = (i) => { setFotos((f) => f.filter((_, k) => k !== i)); setErrores([]) }

  // Mueve la foto i una posición (-1 = antes, +1 = después)
  const mover = (i, paso) => setFotos((f) => {
    const j = i + paso
    if (j < 0 || j >= f.length) return f
    const copia = [...f]
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
    return copia
  })

  return { fotos, errores, cargando: false, recorte, elegir, confirmarRecorte, cancelarRecorte, recortar, puedeRecortar, quitar, mover }
}

export default useImagenesLibro
