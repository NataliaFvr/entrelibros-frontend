import { useState } from 'react'
import { FORMATOS_IMAGEN } from '../utils/imagen'
import ImageCropper from './ImageCropper'

// Subir foto de perfil: abre el recortador y entrega un JPEG base64; el backend valida el archivo.
// "Quitar foto" saca la foto o el avatar elegido (`onQuitar`) y el perfil vuelve a mostrar las iniciales.
const PhotoControls = ({ onFoto, onQuitar, hayImagen = true }) => {
  const [archivo, setArchivo] = useState(null)

  const elegir = (e) => {
    const f = e.target.files[0]
    e.target.value = ''
    if (!f) return
    setArchivo(f)
  }

  return (
    <div>
      <label className="more up">
        Subir foto
        <input type="file" hidden onChange={elegir} />
      </label>{' '}
      <button className="more" type="button" onClick={onQuitar} disabled={!hayImagen}>Quitar foto</button>
      <small>Si no tenés foto, elegí un avatar; si no, se muestran tus iniciales.</small>
      {archivo && (
        <ImageCropper origen={archivo} {...FORMATOS_IMAGEN.perfil}
          onListo={(d) => { onFoto(d); setArchivo(null) }} onCancelar={() => setArchivo(null)} />
      )}
    </div>
  )
}

export default PhotoControls
