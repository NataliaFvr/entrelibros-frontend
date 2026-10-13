import { useEffect, useState } from 'react'

// Botón de dos pasos: el primer toque pide confirmar, y si no se confirma en 4 s vuelve a lo normal
const ConfirmLink = ({ texto, onConfirmar, textoConfirmar = '¿Seguro? Tocá de nuevo para cancelar', className = 'lnk' }) => {
  const [armado, setArmado] = useState(false)

  useEffect(() => {
    if (!armado) return
    const t = setTimeout(() => setArmado(false), 4000)
    return () => clearTimeout(t)
  }, [armado])

  return (
    <button className={className} type="button" onClick={() => (armado ? onConfirmar() : setArmado(true))}>
      {armado ? textoConfirmar : texto}
    </button>
  )
}

export default ConfirmLink
