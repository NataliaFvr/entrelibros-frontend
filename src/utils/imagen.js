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
