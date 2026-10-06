import { useCallback, useEffect, useRef, useState } from 'react'
import { MIN_LADO_FOTO } from '../utils/imagen'
import { ZOOM_MAX, ZOOM_MIN, cargarImagen, mover, recortarAImagen, ventanaOrigen } from '../utils/recorte'
import './ImageCropper.css'

const PASO_TECLADO = 0.03 // fracción de la ventana por pulsación de flecha

// Pop-up para centrar y recortar una imagen: se arrastra para moverla y el control (o +/−) acerca o aleja.
// `origen`: File o URL. `aspecto`: ancho/alto del recorte. `circular`: solo cambia la guía visual (el archivo sale cuadrado).
// `onListo(dataUrl)` entrega un JPEG en base64; `onCancelar()` descarta. Se cierra con Escape.
const ImageCropper = ({ origen, aspecto = 1, anchoMax = 600, circular = false, titulo = 'Recortar imagen', onListo, onCancelar }) => {
  const [img, setImg] = useState(null)
  const [error, setError] = useState('')
  const [vista, setVista] = useState({ zoom: 1, cx: 0.5, cy: 0.5 })
  const [trabajando, setTrabajando] = useState(false)
  const marcoRef = useRef(null)
  const arrastre = useRef(null)
  const cancelarRef = useRef(onCancelar)

  useEffect(() => { cancelarRef.current = onCancelar })

  useEffect(() => {
    let vigente = true
    cargarImagen(origen)
      .then((i) => {
        if (!vigente) return
        if (Math.min(i.naturalWidth, i.naturalHeight) < MIN_LADO_FOTO) setError(`La imagen es muy chica (mínimo ${MIN_LADO_FOTO} px de lado).`)
        else setImg(i)
      })
      .catch((e) => { if (vigente) setError(e.message) })
    return () => { vigente = false }
  }, [origen])

  useEffect(() => {
    const alEscape = (e) => { if (e.key === 'Escape') cancelarRef.current() }
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', alEscape)
    return () => { document.body.style.overflow = previo; window.removeEventListener('keydown', alEscape) }
  }, [])

  const estado = useCallback((v) => ({ imgW: img.naturalWidth, imgH: img.naturalHeight, aspecto, ...v }), [img, aspecto])
  const ventana = img ? ventanaOrigen(estado(vista)) : null

  const alBajar = (e) => {
    if (!img) return
    e.currentTarget.setPointerCapture(e.pointerId)
    arrastre.current = { x: e.clientX, y: e.clientY, vista }
  }
  const alMover = (e) => {
    const a = arrastre.current
    if (!a || !img) return
    const caja = marcoRef.current.getBoundingClientRect()
    const v0 = ventanaOrigen(estado(a.vista))
    const aImg = v0.sw / caja.width // píxeles de la imagen por píxel de pantalla
    const n = mover(estado(a.vista), (e.clientX - a.x) * aImg, (e.clientY - a.y) * aImg)
    setVista({ zoom: n.zoom, cx: n.cx, cy: n.cy })
  }
  const alSoltar = () => { arrastre.current = null }

  const cambiarZoom = (zoom) => {
    if (!img) return
    const v = ventanaOrigen(estado({ ...vista, zoom }))
    setVista({ zoom: v.zoom, cx: v.cx, cy: v.cy })
  }

  const alTeclear = (e) => {
    if (!img) return
    const v = ventanaOrigen(estado(vista))
    const mapa = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }
    if (mapa[e.key]) {
      e.preventDefault()
      const [dx, dy] = mapa[e.key]
      const n = mover(estado(vista), -dx * v.sw * PASO_TECLADO * 3, -dy * v.sh * PASO_TECLADO * 3)
      setVista({ zoom: n.zoom, cx: n.cx, cy: n.cy })
    } else if (e.key === '+' || e.key === '=') cambiarZoom(vista.zoom + 0.2)
    else if (e.key === '-') cambiarZoom(vista.zoom - 0.2)
  }

  const aceptar = () => {
    if (!img || trabajando) return
    setTrabajando(true)
    try {
      onListo(recortarAImagen(img, { aspecto, ...vista }, { anchoMax }))
    } catch {
      // un canvas "contaminado" (imagen de otro dominio sin CORS) no se puede exportar
      setError('No pudimos recortar esta imagen. Probá subiéndola de nuevo desde tu dispositivo.')
      setTrabajando(false)
    }
  }

  // Posición de la imagen dentro del marco, en % del marco (así no hace falta medir nada)
  const estiloImg = ventana && {
    width: `${(img.naturalWidth / ventana.sw) * 100}%`,
    left: `${-(ventana.sx / ventana.sw) * 100}%`,
    top: `${-(ventana.sy / ventana.sh) * 100}%`,
  }

  return (
    <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) onCancelar() }}>
      <div className="modal-card crop-card" role="dialog" aria-modal="true" aria-labelledby="crop-t">
        <button className="modal-x" type="button" aria-label="Cerrar" onClick={onCancelar}>✕</button>
        <h2 className="fr" id="crop-t">{titulo}</h2>
        {error ? (
          <p className="crop-err" role="alert">{error}</p>
        ) : !img ? (
          <p className="crop-load" role="status">Cargando imagen…</p>
        ) : (
          <>
            <p className="crop-help">Arrastrá la imagen para centrarla y usá el control para acercar o alejar.</p>
            <div
              className={`crop-marco${circular ? ' circ' : ''}`} ref={marcoRef} style={{ '--asp': aspecto }} tabIndex={0}
              role="group" aria-label="Zona de recorte. Flechas para mover, más y menos para el zoom"
              onPointerDown={alBajar} onPointerMove={alMover} onPointerUp={alSoltar} onPointerCancel={alSoltar} onKeyDown={alTeclear}
            >
              <img className="crop-img" src={img.src} alt="" draggable={false} style={estiloImg} />
              {circular && <span className="crop-guia" aria-hidden="true" />}
            </div>
            <label className="crop-zoom">
              <span>Zoom</span>
              <input type="range" min={ZOOM_MIN} max={ZOOM_MAX} step="0.01" value={vista.zoom} aria-label="Zoom"
                onChange={(e) => cambiarZoom(parseFloat(e.target.value))} />
            </label>
            <div className="crop-btns">
              <button className="btn alt" type="button" onClick={() => setVista({ zoom: 1, cx: 0.5, cy: 0.5 })}>Centrar</button>
            </div>
          </>
        )}
        <div className="modal-btns crop-acc">
          <button className="btn main" type="button" onClick={aceptar} disabled={!img || trabajando}>Usar esta foto</button>
          <button className="btn alt" type="button" onClick={onCancelar}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}

export default ImageCropper
