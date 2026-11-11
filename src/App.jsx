import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { escucharSesionVencida } from "./api/axiosConfig"
import LoginGate from "./componentes/LoginGate"
import Toast from "./componentes/Toast"
import { useToast } from "./hooks/useToast"
import { fetchDirecciones, fetchMarks, fetchUsuario, logout } from "./redux/authSlice"
import { fetchCarrito } from "./redux/carritoSlice"
import { fetchCategorias } from "./redux/categoriasSlice"
import { fetchLibros } from "./redux/librosSlice"
import { fetchPedidos } from "./redux/pedidosSlice"
import AppRoutes from "./routes/AppRoutes"

const App = () => {
  const dispatch = useDispatch()
  const toast = useToast()
  const user = useSelector((state) => state.auth.user)
  const idUsuario = user ? user.id : null
  const esAdmin = Boolean(user) && user.rol === "ADMIN"
  const idCompra = idUsuario !== null && !esAdmin ? idUsuario : null // el admin no tiene marcapáginas, direcciones, carrito ni pedidos

  useEffect(() => {
    dispatch(fetchLibros())
    dispatch(fetchCategorias())
  }, [dispatch])

  // Si el back dice que la sesión venció (el refresh token tampoco sirvió), se cierra la sesión
  useEffect(
    () => escucharSesionVencida(() => {
      dispatch(logout())
      toast("Tu sesión venció. Volvé a ingresar para continuar.")
    }),
    [dispatch, toast],
  )

  // Al entrar o salir de una cuenta se trae lo suyo (sin sesión quedan vacíos)
  useEffect(() => {
    if (idUsuario !== null) dispatch(fetchUsuario(idUsuario))
  }, [dispatch, idUsuario])

  useEffect(() => {
    if (idCompra !== null) {
      dispatch(fetchMarks(idCompra))
      dispatch(fetchDirecciones(idCompra))
    }
    dispatch(fetchCarrito(idCompra))
    dispatch(fetchPedidos(idCompra))
  }, [dispatch, idCompra])

  return (
    <>
      <AppRoutes />
      <LoginGate />
      <Toast />
    </>
  )
}

export default App