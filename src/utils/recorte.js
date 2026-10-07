// Matemática del recorte de imágenes (sin DOM, para poder probarla). El recorte es una ventana de proporción fija
// (`aspecto` = ancho / alto) que se mueve sobre la imagen original y se achica con el zoom.
//   - zoom 1: la ventana más grande de esa proporción que entra en la imagen.
//   - centro { cx, cy }: centro de la ventana, en fracción de la imagen (0..1). Se acota para que la ventana nunca salga de la imagen.

export const ZOOM_MIN = 1
export const ZOOM_MAX = 4

const acotar = (v, min, max) => Math.min(max, Math.max(min, v))

// Ventana de origen en píxeles de la imagen: { sx, sy, sw, sh } (+ cx, cy ya acotados)
export const ventanaOrigen = ({ imgW, imgH, aspecto, zoom = 1, cx = 0.5, cy = 0.5 }) => {
  const z = acotar(zoom, ZOOM_MIN, ZOOM_MAX)
  const baseW = imgW / imgH > aspecto ? imgH * aspecto : imgW
  const baseH = baseW / aspecto
  const sw = baseW / z
  const sh = baseH / z
  const sx = acotar(cx * imgW - sw / 2, 0, imgW - sw)
  const sy = acotar(cy * imgH - sh / 2, 0, imgH - sh)
  return { sx, sy, sw, sh, cx: (sx + sw / 2) / imgW, cy: (sy + sh / 2) / imgH, zoom: z }
}

// Mueve la ventana `dx`,`dy` píxeles de la imagen (arrastrar la imagen hacia la derecha = ventana hacia la izquierda)
export const mover = (estado, dxImg, dyImg) => {
  const v = ventanaOrigen(estado)
  return ventanaOrigen({ ...estado, cx: (v.sx + v.sw / 2 - dxImg) / estado.imgW, cy: (v.sy + v.sh / 2 - dyImg) / estado.imgH })
}

// Tamaño de la imagen final: nunca más grande que el recorte original (no se agranda una foto chica)
export const tamanioSalida = ({ sw }, anchoMax, aspecto) => {
  const w = Math.max(1, Math.round(Math.min(anchoMax, sw)))
  return { w, h: Math.max(1, Math.round(w / aspecto)) }
}

/* ---------------- Con DOM ---------------- */

// File / Blob / URL -> <img> ya decodificada. Rechaza si no es una imagen válida.
export const liberarImagen = (img) => { if (img && img.src.startsWith('blob:')) URL.revokeObjectURL(img.src) }

export const cargarImagen = (origen) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    const esArchivo = typeof origen !== 'string'
    const url = esArchivo ? URL.createObjectURL(origen) : origen
    if (!esArchivo && /^https?:/.test(url)) img.crossOrigin = 'anonymous' // imágenes del back: hace falta CORS para poder recortarlas
    // el blob NO se revoca acá: la vista previa lo sigue usando (ImageCropper lo libera al cerrar con `liberarImagen`)
    img.onload = () => resolve(img)
    img.onerror = () => { if (esArchivo) URL.revokeObjectURL(url); reject(new Error('No es una imagen válida.')) }
    img.src = url
  })

// Dibuja el recorte y lo devuelve como JPEG en base64 (el fondo blanco evita que un PNG transparente quede negro)
export const recortarAImagen = (img, estado, { anchoMax = 600, calidad = 0.85 } = {}) => {
  const v = ventanaOrigen({ imgW: img.naturalWidth, imgH: img.naturalHeight, ...estado })
  const { w, h } = tamanioSalida(v, anchoMax, estado.aspecto)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, w, h)
  ctx.drawImage(img, v.sx, v.sy, v.sw, v.sh, 0, 0, w, h)
  return canvas.toDataURL('image/jpeg', calidad)
}
