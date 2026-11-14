/* oxlint-disable no-unused-vars */
import { mostrarToast } from './redux/toastSlice'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { escucharSesionVencida } from "./api/axiosConfig"
import LoginGate from "./componentes/LoginGate"
import Toast from "./componentes/Toast"
import { fetchDirecciones, fetchMarks, fetchUsuario, logout } from "./redux/userSlice"
import { fetchCarrito } from "./redux/carritoSlice"
import { fetchCategorias, fetchLibros } from "./redux/librosSlice"
import { fetchPedidos } from "./redux/pedidosSlice"
import AppRoutes from "./routes/AppRoutes"

const App = () => {
  const dispatch = useDispatch()
  const toast = (msg, accion) => dispatch(mostrarToast({ msg, accion }))
  const user = useSelector((state) => state.user.user)
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

  // Solo para una sesión guardada de una visita anterior: el login ya trae los datos de la cuenta
  const [sesionGuardada] = useState(idUsuario)
  useEffect(() => {
    if (sesionGuardada !== null) dispatch(fetchUsuario(sesionGuardada))
  }, [dispatch, sesionGuardada])

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