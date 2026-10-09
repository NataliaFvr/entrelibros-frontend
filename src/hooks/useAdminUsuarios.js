import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from './useAuth'
import { useLibros } from './useLibros'
import { useToast } from './useToast'
import * as admin from '../services/adminService'
import { ETIQUETA_ROL, POR_PAGINA } from '../data/admin'
import { norm } from '../utils/format'

const mensajeDe = (err) => (err && err.message) || 'No pudimos completar la acción. Intentá de nuevo.'

// Lista de usuarios con búsqueda, filtros, paginación y las acciones del administrador.
// Cada acción devuelve { ok } o { error }: los pop-ups muestran el error sin cerrarse.
const useAdminUsuarios = () => {
  const { user, perfil, actualizarPerfil } = useAuth()
  const toast = useToast()
  const { recargar } = useLibros()
  const [usuarios, setUsuarios] = useState([])
  const refrescar = useCallback(async () => setUsuarios(await admin.cargarUsuarios()), [])
  useEffect(() => { // GET /usuarios
    let vigente = true
    admin.cargarUsuarios().then((lista) => { if (vigente) setUsuarios(lista) }).catch(() => {})
    return () => { vigente = false }
  }, [])
  const [filtros, setFiltros] = useState({ q: '', rol: '', est: '' })
  const [pagina, setPagina] = useState(1)

  const filtrados = useMemo(() => {
    const q = norm(filtros.q.trim())
    return usuarios.filter((u) =>
      (!filtros.rol || u.rol === filtros.rol) &&
      (!filtros.est || u.estado === filtros.est) &&
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

  // Corre la acción, refresca la lista y el catálogo (un vendedor dado de baja deja de mostrar sus libros)
  // (con el back las acciones son async: se espera la respuesta antes de refrescar)
  const ejecutar = async (accion, mensaje) => {
    try {
      await accion()
      await refrescar()
      recargar()
      if (mensaje) toast(mensaje)
      return { ok: true }
    } catch (err) {
      return { error: mensajeDe(err) }
    }
  }

  const crear = (v) => ejecutar(() => admin.crearUsuario(v), 'Usuario creado')

  // Editar la propia cuenta pasa por AuthContext: así la sesión sigue al día si cambia el usuario
  const editar = (u, v) => ejecutar(async () => {
    if (!u.propio) return admin.editarUsuario(u.id, v)
    const duplicado = admin.mensajeDuplicado(v, u.nombreUsuario)
    if (duplicado) throw new Error(duplicado)
    return actualizarPerfil(v, perfil)
  }, u.propio ? '' : 'Cambios guardados')

  const cambiarRol = (u, rol) => {
    if (rol === u.rol) {
      toast(`El rol ya era ${ETIQUETA_ROL[rol]}`)
      return { ok: true }
    }
    return ejecutar(() => admin.cambiarRol(u.id, rol), `Rol actualizado a ${ETIQUETA_ROL[rol]}`)
  }

  const darDeBaja = (u) => ejecutar(() => admin.darDeBaja(u.id), 'Usuario dado de baja')
  const reactivar = (u) => ejecutar(() => admin.reactivar(u.id), 'Usuario reactivado')
  const resolverVenta = (u, aprobada) =>
    ejecutar(() => admin.resolverSolicitudVenta(u.id, aprobada), aprobada ? 'Vendedor aprobado' : 'Solicitud rechazada')

  return {
    filtros, filtrar, total: filtrados.length, visibles, pagina: paginaActual, paginas, setPagina,
    crear, editar, cambiarRol, darDeBaja, reactivar, resolverVenta,
  }
}

export default useAdminUsuarios
