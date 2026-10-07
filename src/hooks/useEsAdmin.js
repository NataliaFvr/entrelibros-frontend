import { useAuth } from './useAuth'

// true si quien navega es administrador (en la tienda solo ve inicio, catálogo y fichas, en modo lectura)
const useEsAdmin = () => {
  const { user } = useAuth()
  return user?.rol === 'ADMIN'
}

export default useEsAdmin
