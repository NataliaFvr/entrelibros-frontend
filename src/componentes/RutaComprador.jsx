import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

// Envuelve las rutas que son solo de compradores y vendedores (cuenta, estantería, pagos, vender, ayuda, etc.).
// El administrador no tiene perfil de comprador: si llega, va a su panel de gestión.
const RutaComprador = () => {
  const esAdmin = useSelector((state) => state.user.user?.rol === 'ADMIN')
  return esAdmin ? <Navigate to="/admin" replace /> : <Outlet />
}

export default RutaComprador
