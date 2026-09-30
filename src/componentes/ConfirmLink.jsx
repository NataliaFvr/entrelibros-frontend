import { useEffect, useState } from 'react'

// Botón de dos pasos: el primer toque pide confirmar, y si no se confirma en 4 s vuelve a lo normal
const ConfirmLink = ({ texto, onConfirmar }) => {
  const [armado, setArmado] = useState(false)

  useEffect(() => {
    if (!armado) return
    const t = setTimeout(() => setArmado(false), 4000)
    return () => clearTimeout(t)
  }, [armado])

  return (
    <button className="lnk" type="button" onClick={() => (armado ? onConfirmar() : setArmado(true))}>
      {armado ? '¿Seguro? Tocá de nuevo para cancelar' : texto}
    </button>
  )
}

export default ConfirmLink
