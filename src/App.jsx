import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { escucharSesionVencida } from "./api/axiosConfig"
import LoginGate from "./componentes/auth/LoginGate"
import Toast from "./componentes/comun/Toast"
import { fetchCarrito } from "./redux/carritoSlice"
import { fetchCategorias, fetchLibros } from "./redux/librosSlice"
import { fetchPedidos } from "./redux/pedidosSlice"
import { mostrarToast } from './redux/toastSlice'
import { fetchDirecciones, fetchMarks, fetchUsuario, logout } from "./redux/userSlice"
import AppRoutes from "./routes/AppRoutes"

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user)
  const idUsuario = user ? user.id : null
  const esAdmin = Boolean(user) && user.rol === "ADMIN"
  const idCompra = idUsuario !== null && !esAdmin ? idUsuario : null // el admin no tiene marcapáginas, direcciones, carrito ni pedidos
  const librosCargados = useSelector((state) => state.libros.cargado)
  const categoriasCargadas = useSelector((state) => state.libros.categorias.cargada)
  const cargasSesion = useSelector((state) => state.user.cargas)
  const carritoUsuario = useSelector((state) => state.carrito.usuarioSolicitado)
  const pedidosUsuario = useSelector((state) => state.pedidos.usuarioSolicitado)

  useEffect(() => {
    if (!librosCargados) dispatch(fetchLibros())
    if (!categoriasCargadas) dispatch(fetchCategorias())
  }, [dispatch, librosCargados, categoriasCargadas])

  // Si el back dice que la sesión venció (el refresh token tampoco sirvió), se cierra la sesión
  useEffect(
  () => escucharSesionVencida(() => {
    dispatch(logout())
    dispatch(mostrarToast({ msg: "Tu sesión venció. Volvé a ingresar para continuar." }))
  }),
  [dispatch],
)

  // Solo para una sesión guardada de una visita anterior: el login ya trae los datos de la cuenta
  const [sesionGuardada] = useState(idUsuario)
  useEffect(() => {
    if (sesionGuardada !== null && cargasSesion.perfil !== sesionGuardada) dispatch(fetchUsuario(sesionGuardada))
  }, [dispatch, sesionGuardada, cargasSesion.perfil])

  useEffect(() => {
    if (idCompra !== null) {
      if (cargasSesion.marks !== idCompra) dispatch(fetchMarks(idCompra))
      if (cargasSesion.direcciones !== idCompra) dispatch(fetchDirecciones(idCompra))
      if (carritoUsuario !== idCompra) dispatch(fetchCarrito(idCompra))
      if (pedidosUsuario !== idCompra) dispatch(fetchPedidos(idCompra))
    }
  }, [dispatch, idCompra, cargasSesion.marks, cargasSesion.direcciones, carritoUsuario, pedidosUsuario])

  return (
    <>
      <AppRoutes />
      <LoginGate />
      <Toast />
    </>
  )
}

export default App
