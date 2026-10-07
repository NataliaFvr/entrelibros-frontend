import { useState } from 'react'
import { textOn } from '../utils/colors'

// Círculo de una categoría: su imagen si la tiene y carga bien; si no hay imagen o el servidor responde 404 (onError),
// el círculo de color con la inicial. `src` puede ser una URL (/categorias/{id}/imagen) o una imagen en base64.
const CategoriaCirculo = ({ nombre, src, color, claseImg = 'cat-img' }) => {
  const [rota, setRota] = useState('')
  const hayImagen = Boolean(src) && rota !== src
  return (
    <>
      {hayImagen
        ? <img className={claseImg} src={src} alt="" loading="lazy" onError={() => setRota(src)} />
        : <span style={color ? { color: textOn(color) } : undefined}>{nombre[0]}</span>}
    </>
  )
}

export default CategoriaCirculo
