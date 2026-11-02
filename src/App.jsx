import { useEffect } from "react"
import { useDispatch } from "react-redux"
import AuthProvider from "./context/AuthContext"
import ToastProvider from "./context/ToastContext"
import { useAuth } from "./hooks/useAuth"
import { fetchCarrito } from "./Redux/carritoSlice"
import { fetchCategorias } from "./Redux/categoriasSlice"
import { fetchLibros } from "./Redux/librosSlice"
import { fetchPedidos } from "./Redux/pedidosSlice"
import AppRoutes from "./routes/AppRoutes"

const Contenido = () => {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const idUsuario = user && user.rol !== "ADMIN" ? user.id : null // el admin no tiene carrito ni pedidos

  useEffect(() => {
    dispatch(fetchLibros())
    dispatch(fetchCategorias())
  }, [dispatch])

  // Al entrar o salir de una cuenta se trae su carrito y sus pedidos (sin sesión quedan vacíos)
  useEffect(() => {
    dispatch(fetchCarrito(idUsuario))
    dispatch(fetchPedidos(idUsuario))
  }, [dispatch, idUsuario])

  return <AppRoutes />
}

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <Contenido />
      </AuthProvider>
    </ToastProvider>
  )
}

export default App