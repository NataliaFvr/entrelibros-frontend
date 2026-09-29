import { useEffect, useRef, useState } from 'react'

const COLORES = ['#5EB1BF', '#EF7B45', '#D84727', '#2f7d89']

// Una letra del tagline: cambia de color al pasar el cursor y vuelve a su color base
const Letra = ({ children }) => {
  const [color, setColor] = useState('')
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const entrar = () => {
    clearTimeout(timer.current)
    setColor(COLORES[Math.floor(Math.random() * COLORES.length)])
  }
  const salir = () => { timer.current = setTimeout(() => setColor(''), 700) }

  return (
    <span className="letter" style={color ? { color } : undefined} onMouseEnter={entrar} onMouseLeave={salir}>
      {children}
    </span>
  )
}

export default Letra
