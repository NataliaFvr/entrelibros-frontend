import { getLibrosApi } from './librosApi'
import { listarCategoriasApi } from './categoriasApi'
import { getResenasLibroApi } from './resenasApi'
export const getLibros = getLibrosApi

export const getCategorias = async () => (await listarCategoriasApi()).map((c) => c.nombre)
export const getCategoriasTodas = getCategorias
export const getResenias = getResenasLibroApi
