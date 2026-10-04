import { useState } from 'react'
import { MAX_BYTES_FOTO, MAX_FOTOS, TIPOS_FOTO, reducirFoto } from '../utils/imagen'

// Fotos de un libro (base64) con su lista de errores: agregar varias, quitar y reordenar.
// La primera es la portada; las demás forman el carrusel de la ficha.
const useImagenesLibro = (inicial = []) => {
  const [fotos, setFotos] = useState(inicial)
  const [errores, setErrores] = useState([])
  const [cargando, setCargando] = useState(false)

  const agregar = async (archivos) => {
    const nuevos = []
    const faltas = []
    let lugar = MAX_FOTOS - fotos.length

    for (const archivo of archivos) {
      if (lugar <= 0) { faltas.push(`Máximo ${MAX_FOTOS} fotos por libro.`); break }
      if (!TIPOS_FOTO.includes(archivo.type)) { faltas.push(`${archivo.name}: solo JPG o PNG.`); continue }
      if (archivo.size > MAX_BYTES_FOTO) { faltas.push(`${archivo.name}: supera los 10 MB.`); continue }
      try {
        nuevos.push(await reducirFoto(archivo))
        lugar -= 1
      } catch {
        faltas.push(`${archivo.name}: no es una imagen válida.`)
      }
    }
    setFotos((f) => [...f, ...nuevos].slice(0, MAX_FOTOS))
    setErrores(faltas)
  }

  const elegir = async (archivos) => {
    setCargando(true)
    await agregar([...archivos])
    setCargando(false)
  }

  const quitar = (i) => { setFotos((f) => f.filter((_, k) => k !== i)); setErrores([]) }

  // Mueve la foto i una posición (-1 = antes, +1 = después)
  const mover = (i, paso) => setFotos((f) => {
    const j = i + paso
    if (j < 0 || j >= f.length) return f
    const copia = [...f]
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
    return copia
  })

  return { fotos, errores, cargando, elegir, quitar, mover }
}

export default useImagenesLibro
