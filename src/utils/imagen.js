// Reglas de las fotos. Espejan las del back (ImagenValidator / ImagenesLibroController): solo JPG o PNG, hasta 10 MB.
// Las fotos de libro: mínimo 1 y máximo 5 por publicación.
export const MIN_FOTOS = 1
export const MAX_FOTOS = 5
export const TIPOS_FOTO = ['image/jpeg', 'image/png']
export const MAX_BYTES_FOTO = 10 * 1024 * 1024
export const MIN_LADO_FOTO = 150 // px: más chica no se ve bien ni recortada

// Proporciones y tamaños de salida de cada tipo de imagen
export const FORMATOS_IMAGEN = {
  libro: { aspecto: 3 / 4, anchoMax: 600, titulo: 'Recortar foto del libro' },
  perfil: { aspecto: 1, anchoMax: 256, titulo: 'Recortar foto de perfil', circular: true },
  categoria: { aspecto: 1, anchoMax: 320, titulo: 'Recortar imagen de la categoría', circular: true },
}

// Mensaje de error de un archivo, o '' si sirve (tipo y peso; el tamaño en píxeles lo revisa el recortador al abrirla)
export const validarArchivoImagen = (archivo) => {
  if (!archivo) return 'Elegí una imagen.'
  if (!TIPOS_FOTO.includes(archivo.type)) return `${archivo.name}: solo JPG o PNG.`
  if (archivo.size > MAX_BYTES_FOTO) return `${archivo.name}: supera los 10 MB.`
  if (archivo.size === 0) return `${archivo.name}: el archivo está vacío.`
  return ''
}
