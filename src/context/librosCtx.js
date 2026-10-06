import { createContext } from 'react'

export const LibrosCtx = createContext({ libros: [], categorias: [], imagenesCategorias: {}, cargando: true, recargar: () => {}, recargarCategorias: () => {} })
