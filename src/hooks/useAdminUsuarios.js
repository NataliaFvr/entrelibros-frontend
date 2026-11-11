import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ETIQUETA_ROL, POR_PAGINA } from '../data/admin'
import { fetchLibros } from '../redux/librosSlice'
import {
  cambiarRol as cambiarRolAccion, crearUsuario, darDeBajaUsuario, editarUsuario, fetchUsuarios, reactivarUsuario, resolverSolicitud,
} from '../redux/usuariosSlice'
import { norm } from '../utils/format'
import { useAuth } from './useAuth'
import { useToast } from './useToast'

// Cada acción devuelve { ok } o { error }: los pop-ups muestran el error sin cerrarse
const useAdminUsuarios = () => {
  const dispatch = useDispatch()
  const { user, perfil, actualizarPerfil } = useAuth()
  const toast = useToast()
  const { items: usuarios, cargados } = useSelector((state) => state.usuarios)
  const [filtros, setFiltros] = useState({ q: '', rol: '', est: '', solicitud: '' })
  const [pagina, setPagina] = useState(1)

  useEffect(() => {
    if (!cargados) dispatch(fetchUsuarios())
  }, [dispatch, cargados])

  const filtrados = useMemo(() => {
    const q = norm(filtros.q.trim())
    return usuarios.filter((u) =>
      (!filtros.rol || u.rol === filtros.rol) &&
      (!filtros.est || u.estado === filtros.est) &&
      (!filtros.solicitud || (filtros.solicitud === 'PENDIENTE' && u.quiereVender)) &&
      (!q || norm(`${u.nombre} ${u.apellido} ${u.nombreUsuario} ${u.email}`).includes(q)))
  }, [usuarios, filtros])

  const paginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  const paginaActual = Math.min(pagina, paginas)
  const visibles = filtrados
    .slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA)
    .map((u) => ({ ...u, propio: u.nombreUsuario === user.nombreUsuario }))

  const filtrar = (campo, valor) => {
    setFiltros((f) => ({ ...f, [campo]: valor }))
    setPagina(1)
  }

  const ejecutar = async (accion, mensaje) => {
    const resultado = await dispatch(accion)
    if (resultado.error) return { error: resultado.error.message }
    if (mensaje) toast(mensaje)
    return { ok: true }
  }

  const crear = (v) => ejecutar(crearUsuario(v), 'Usuario creado')

  const editar = async (u, v) => {
    // La propia cuenta pasa por authSlice: así la sesión sigue al día
    if (u.propio) {
      try {
        await actualizarPerfil(v, perfil)
        return { ok: true }
      } catch (err) {
        return { error: err.message }
      }
    }
    const cambios = { nombre: v.nombre.trim(), apellido: v.apellido.trim(), nombreUsuario: v.nombreUsuario, email: v.email.trim() }
    if (v.contrasena) cambios.contrasena = v.contrasena
    return ejecutar(editarUsuario({ id: u.id, cambios }), 'Cambios guardados')
  }

  const cambiarRol = (u, rol, datosVendedor) => {
    if (rol === u.rol) {
      toast(`El rol ya era ${ETIQUETA_ROL[rol]}`)
      return { ok: true }
    }
    return ejecutar(cambiarRolAccion({ id: u.id, rol, datosVendedor }), `Rol actualizado a ${ETIQUETA_ROL[rol]}`)
  }

  const darDeBaja = (u) => ejecutar(darDeBajaUsuario(u.id), 'Usuario dado de baja')

  const reactivar = async (u) => {
    const respuesta = await ejecutar(reactivarUsuario(u.id), 'Usuario reactivado')
    // El back vuelve a publicar todos sus libros y solo devuelve el usuario: hay que pedir el catálogo
    if (respuesta.ok && u.rol === 'VENDEDOR') dispatch(fetchLibros())
    return respuesta
  }

  const resolverVenta = (u, aprobada, comentario) =>
    ejecutar(resolverSolicitud({ id: u.id, aprobada, comentario }), aprobada ? 'Vendedor aprobado' : 'Solicitud rechazada')

  return {
    filtros, filtrar, total: filtrados.length,
    solicitudesPendientes: usuarios.filter((u) => u.quiereVender).length,
    visibles, pagina: paginaActual, paginas, setPagina,
    crear, editar, cambiarRol, darDeBaja, reactivar, resolverVenta,
  }
}

export default useAdminUsuarios
