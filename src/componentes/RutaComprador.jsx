import { Navigate, Outlet } from 'react-router-dom'
import useEsAdmin from '../hooks/useEsAdmin'

// Envuelve las rutas que son solo de compradores y vendedores (cuenta, estantería, pagos, vender, ayuda, etc.).
// El administrador no tiene perfil de comprador: si llega, va a su panel de gestión.
const RutaComprador = () => (useEsAdmin() ? <Navigate to="/admin" replace /> : <Outlet />)

export default RutaComprador
