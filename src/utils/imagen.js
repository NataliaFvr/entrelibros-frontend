// Recorta una foto al cuadrado central y la reduce a 200x200 (JPEG en base64)
export const recortarFoto = (archivo) =>
  new Promise((resolve, reject) => {
    const lector = new FileReader()
    lector.onerror = reject
    lector.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const lado = Math.min(img.width, img.height)
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = 200
        canvas.getContext('2d').drawImage(img, (img.width - lado) / 2, (img.height - lado) / 2, lado, lado, 0, 0, 200, 200)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.src = lector.result
    }
    lector.readAsDataURL(archivo)
  })

// Fotos de un libro: mínimo 1 y máximo 5 por publicación (JPG o PNG, hasta 10 MB cada una)
export const MIN_FOTOS = 1
export const MAX_FOTOS = 5
export const TIPOS_FOTO = ['image/jpeg', 'image/png']
export const MAX_BYTES_FOTO = 10 * 1024 * 1024

// Reduce una foto de libro a 600 px de lado mayor (JPEG en base64) para que entre en localStorage.
// Back: estas fotos se suben como multipart y se guardan como ImagenLibro.
export const reducirFoto = (archivo, ladoMax = 600) =>
  new Promise((resolve, reject) => {
    const lector = new FileReader()
    lector.onerror = reject
    lector.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const k = Math.min(1, ladoMax / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * k)
        canvas.height = Math.round(img.height * k)
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#fff' // los PNG con transparencia no quedan negros
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
      img.src = lector.result
    }
    lector.readAsDataURL(archivo)
  })
