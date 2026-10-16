// Configuración de presentación para el recortador. La aceptación de archivos
// (formato, tamaño, dimensiones y cantidad) corresponde al backend.
export const FORMATOS_IMAGEN = {
  libro: { aspecto: 3 / 4, anchoMax: 600, titulo: 'Recortar foto del libro' },
  perfil: { aspecto: 1, anchoMax: 256, titulo: 'Recortar foto de perfil', circular: true },
  categoria: { aspecto: 1, anchoMax: 320, titulo: 'Recortar imagen de la categoría', circular: true },
}

