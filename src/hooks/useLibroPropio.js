import { useAuth } from './useAuth'
import { esLibroPropio, libroEnRevision, rutaEdicion } from '../services/vendedorService'

// ¿El libro es una publicación de la cuenta con sesión? Un vendedor no compra ni guarda lo suyo:
// en su lugar puede editarlo. Sin sesión (o sin ser vendedor) siempre da false.
const useLibroPropio = () => {
  const { user } = useAuth()
  return {
    esPropio: (libro) => esLibroPropio(user, libro),
    rutaEdicion: (libro) => rutaEdicion(user, libro),
    enRevision: (libro) => libroEnRevision(user, libro), // tiene cambios pendientes: no se puede volver a editar
  }
}

export default useLibroPropio
