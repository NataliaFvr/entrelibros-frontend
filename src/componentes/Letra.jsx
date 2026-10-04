import { useEffect, useRef, useState } from 'react'
import { COLORES_LETRA } from '../utils/colors'

// Una letra: cambia de color al pasar el cursor y vuelve a su color base.
// `colores` permite usar solo los que se leen sobre el fondo donde está la letra.
const Letra = ({ children, colores = COLORES_LETRA }) => {
  const [color, setColor] = useState('')
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const entrar = () => {
    clearTimeout(timer.current)
    setColor(colores[Math.floor(Math.random() * colores.length)])
  }
  const salir = () => { timer.current = setTimeout(() => setColor(''), 700) }

  return (
    <span className="letter" style={color ? { color } : undefined} onMouseEnter={entrar} onMouseLeave={salir}>
      {children}
    </span>
  )
}

export default Letra
