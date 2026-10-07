import { useCallback, useEffect, useRef, useState } from 'react'
import { getMisLibrosApi } from '../api/librosApi'
import { mensajeError } from '../utils/errorApi'
import { useToast } from './useToast'

// Carga los libros del vendedor desde el back (GET /libros?idVendedores=…) y expone en qué estado está la carga:
//   'cargando' | 'ok' | 'error'
// - 'ok' con libros = [] significa "el back respondió que no hay libros" (404 { error } o página vacía): ahí sí corresponde el estado vacío.
// - 'error' es cualquier otro fallo (401, 403, 500, red…): se avisa con un toast (mensajeError) y NUNCA se confunde con "sin libros".
// `activo` en false (modo demo, o cuenta que todavía no es vendedora) no pide nada y queda en 'ok'.
const useMisLibros = (idVendedor, activo) => {
  const toast = useToast()
  const avisar = useRef(toast)
  useEffect(() => { avisar.current = toast }, [toast])

  const [estado, setEstado] = useState(activo ? 'cargando' : 'ok')
  const [libros, setLibros] = useState([])
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    if (!activo) return undefined
    let vigente = true
    setEstado('cargando')
    getMisLibrosApi(idVendedor)
      .then((lista) => { if (vigente) { setLibros(lista); setEstado('ok') } })
      .catch((err) => { if (vigente) { setEstado('error'); avisar.current(mensajeError(err, 'libro')) } })
    return () => { vigente = false }
  }, [idVendedor, activo, intento])

  const reintentar = useCallback(() => setIntento((n) => n + 1), [])
  return { estado, libros, reintentar }
}

export default useMisLibros
