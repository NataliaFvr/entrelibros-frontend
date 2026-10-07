import { useState } from 'react'
import { useToast } from '../hooks/useToast'
import { FORMATOS_IMAGEN, validarArchivoImagen } from '../utils/imagen'
import ImageCropper from './ImageCropper'

// Subir foto de perfil: valida el archivo, abre el recortador (cuadrado, guía circular) y entrega un JPEG base64.
// "Quitar foto" saca la foto o el avatar elegido (`onQuitar`) y el perfil vuelve a mostrar las iniciales.
const PhotoControls = ({ onFoto, onQuitar, hayImagen = true }) => {
  const toast = useToast()
  const [archivo, setArchivo] = useState(null)

  const elegir = (e) => {
    const f = e.target.files[0]
    e.target.value = ''
    if (!f) return
    const falta = validarArchivoImagen(f)
    if (falta) return toast(falta)
    setArchivo(f)
  }

  return (
    <div>
      <label className="more up">
        Subir foto
        <input type="file" accept="image/jpeg,image/png" hidden onChange={elegir} />
      </label>{' '}
      <button className="more" type="button" onClick={onQuitar} disabled={!hayImagen}>Quitar foto</button>
      <small>JPG o PNG, hasta 10 MB. Si no tenés foto, elegí un avatar; si no, se muestran tus iniciales.</small>
      {archivo && (
        <ImageCropper origen={archivo} {...FORMATOS_IMAGEN.perfil}
          onListo={(d) => { onFoto(d); setArchivo(null) }} onCancelar={() => setArchivo(null)} />
      )}
    </div>
  )
}

export default PhotoControls
