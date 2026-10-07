import { useCallback, useEffect, useRef, useState } from 'react'
import { mensajeError } from '../utils/errorApi'
import { useToast } from './useToast'

// Ejecuta la carga de "Mis libros" (`cargar`: función que devuelve una promesa) y expone en qué estado está:
//   'cargando' | 'ok' | 'error'
// - 'ok' significa que el back respondió. Si no hay libros (404 { error } de ListaVacia, ya convertido en [] por la capa api),
//   corresponde el estado vacío ("Todavía no publicaste libros").
// - 'error' es cualquier otro fallo (401, 403, 500, red…): se avisa con un toast (mensajeError) y NUNCA se confunde con "sin libros".
// `activo` en false (modo demo, o cuenta que todavía no es vendedora) no pide nada y queda en 'ok'.
const useMisLibros = (activo, cargar) => {
  const toast = useToast()
  const ultimo = useRef({ toast, cargar })
  useEffect(() => { ultimo.current = { toast, cargar } })

  const [estado, setEstado] = useState(activo ? 'cargando' : 'ok')
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    if (!activo) return undefined
    let vigente = true
    setEstado('cargando')
    Promise.resolve()
      .then(() => ultimo.current.cargar())
      .then(() => { if (vigente) setEstado('ok') })
      .catch((err) => { if (vigente) { setEstado('error'); ultimo.current.toast(mensajeError(err, 'libro')) } })
    return () => { vigente = false }
  }, [activo, intento])

  const reintentar = useCallback(() => setIntento((n) => n + 1), [])
  return { estado, reintentar }
}

export default useMisLibros
