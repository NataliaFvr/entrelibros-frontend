import { useState } from 'react'
import { FORMATOS_IMAGEN, validarArchivoImagen } from '../utils/imagen'
import ImageCropper from './ImageCropper'
import './CategoryImageField.css'

// Foto de categoría: misma mecánica que las fotos de libros (JPG/PNG hasta 10 MB, recorte antes de guardar).
// `valor`: base64 actual ('' = sin foto). `onChange(base64 | '')`.
const CategoryImageField = ({ valor, onChange }) => {
  const [archivo, setArchivo] = useState(null)
  const [error, setError] = useState('')

  const elegir = (e) => {
    const f = e.target.files[0]
    e.target.value = ''
    if (!f) return
    const falta = validarArchivoImagen(f)
    setError(falta)
    if (!falta) setArchivo(f)
  }

  return (
    <div className="cif">
      <span className="cif-lead">Foto de la categoría (opcional)</span>
      <div className="cif-row">
        <span className="cif-prev" aria-hidden="true">{valor ? <img src={valor} alt="" /> : '+'}</span>
        <div className="cif-acc">
          <label className="more up">
            {valor ? 'Cambiar foto' : 'Subir foto'}
            <input type="file" accept="image/jpeg,image/png" hidden onChange={elegir} />
          </label>
          {valor && <button className="more" type="button" onClick={() => setArchivo(valor)}>Recortar</button>}
          {valor && <button className="more" type="button" onClick={() => onChange('')}>Quitar</button>}
        </div>
      </div>
      <small className="cif-hint">JPG o PNG, hasta 10 MB. Se muestra en círculo en el inicio.</small>
      {error && <p className="fld-err" role="alert">{error}</p>}
      {archivo && (
        <ImageCropper origen={archivo} {...FORMATOS_IMAGEN.categoria}
          onListo={(d) => { onChange(d); setArchivo(null) }} onCancelar={() => setArchivo(null)} />
      )}
    </div>
  )
}

export default CategoryImageField
