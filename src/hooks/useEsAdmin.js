import { useSelector } from 'react-redux'

// true si quien navega es administrador (en la tienda solo ve inicio, catálogo y fichas, en modo lectura)
const useEsAdmin = () => useSelector((state) => state.user.user?.rol === 'ADMIN')

export default useEsAdmin