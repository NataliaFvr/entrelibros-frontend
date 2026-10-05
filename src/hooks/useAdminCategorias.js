import { useLibros } from './useLibros'
import { useToast } from './useToast'
import { crearCategoria } from '../services/adminService'

// Categorías del catálogo y alta de una nueva. `crear` devuelve { ok } o { error }.
const useAdminCategorias = () => {
  const toast = useToast()
  const { categorias, recargarCategorias } = useLibros()

  const crear = async (nombre) => {
    try {
      await crearCategoria(nombre)
      await recargarCategorias()
      toast('Categoría creada')
      return { ok: true }
    } catch (err) {
      return { error: (err && err.message) || 'No pudimos crear la categoría. Intentá de nuevo.' }
    }
  }

  return { categorias, crear }
}

export default useAdminCategorias
