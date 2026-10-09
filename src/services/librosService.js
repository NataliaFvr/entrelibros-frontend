import { getLibrosApi } from '../api/librosApi'
import { listarCategoriasApi } from '../api/categoriasApi'
import { getResenasLibroApi } from '../api/resenasApi'
export const getLibros = getLibrosApi

export const getCategorias = async () => (await listarCategoriasApi()).map((c) => c.nombre)
export const getCategoriasTodas = getCategorias
export const getResenias = getResenasLibroApi
