import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

const RETARDO_CIERRE = 160 // ms: deja cruzar el hueco entre el botón y el panel sin que se cierre

// Estado de un menú desplegable de la barra de navegación.
// - Mouse: se abre al pasar por encima y se cierra al salir (con un pequeño retardo).
// - Táctil / teclado: se abre y cierra con el botón (`alternar`).
// - Se cierra solo con Escape, al tocar fuera, al cambiar de ruta o al elegir un enlace (`cerrar`).
// `ref` va en el contenedor del menú (botón + panel) para detectar los toques de afuera.
const useMenuDesplegable = () => {
  const { key } = useLocation()
  const ref = useRef(null)
  const temporizador = useRef(null)
  // Guardamos en qué navegación se abrió: si la ruta cambia, ya no coincide y queda cerrado
  const [abiertoEn, setAbiertoEn] = useState(null)
  const abierto = abiertoEn === key

  const limpiar = () => { clearTimeout(temporizador.current); temporizador.current = null }
  const cerrar = useCallback(() => { clearTimeout(temporizador.current); setAbiertoEn(null) }, [])
  const abrir = () => { limpiar(); setAbiertoEn(key) }
  const alternar = () => { limpiar(); setAbiertoEn(abierto ? null : key) }

  useEffect(() => {
    if (!abierto) return undefined
    const alTocarFuera = (e) => { if (ref.current && !ref.current.contains(e.target)) cerrar() }
    const alTeclear = (e) => {
      if (e.key !== 'Escape') return
      cerrar()
      ref.current?.querySelector('[aria-haspopup]')?.focus() // el foco vuelve al botón que lo abrió
    }
    document.addEventListener('pointerdown', alTocarFuera)
    document.addEventListener('keydown', alTeclear)
    return () => {
      document.removeEventListener('pointerdown', alTocarFuera)
      document.removeEventListener('keydown', alTeclear)
    }
  }, [abierto, cerrar])

  useEffect(() => () => clearTimeout(temporizador.current), [])

  // Solo el mouse abre y cierra por hover; el táctil emula "hover" al tocar y chocaría con el botón
  const alEntrar = (e) => { if (e.pointerType === 'mouse') abrir() }
  const alSalir = (e) => {
    if (e.pointerType !== 'mouse') return
    limpiar()
    temporizador.current = setTimeout(() => setAbiertoEn(null), RETARDO_CIERRE)
  }
  // Si el foco sale del menú (Tab), se cierra
  const alPerderFoco = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) cerrar() }

  return { ref, abierto, alternar, cerrar, props: { ref, onPointerEnter: alEntrar, onPointerLeave: alSalir, onBlur: alPerderFoco } }
}

export default useMenuDesplegable
