import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { urlFotoUsuario } from '../api/usuariosApi'
import {
    abrirGate, cancelarVerificacion, cerrarGate, confirmarEmail, crearDireccion, eliminarDireccion, fetchUsuario, guardarPerfil,
    limpiarPendiente, login, logout, marcarPrincipal, quitarMarks,
    reenviarCodigo,
    registrar,
    toggleMark,
} from '../redux/authSlice'
import { useToast } from './useToast'

// Sesión y datos de la cuenta (Redux/authSlice.js). Acá se arman los avisos y las respuestas que esperan los formularios.
export const useAuth = () => {
  const dispatch = useDispatch()
  const toast = useToast()
  const { user, marks, direcciones, gate, gateDestino, pendiente, verif } = useSelector((state) => state.auth)
  const perfil = useMemo(() => (user ? { avatar: user.avatar || '', foto: user.tieneFoto ? urlFotoUsuario(user.id) : '' } : {}), [user])

  // Los thunks de sesión devuelven { user }, { verif } o { error, tipo, campos }; si falló de forma inesperada no hay payload
  const respuesta = (resultado) => resultado.payload || { error: resultado.error.message }

  const iniciarSesion = async (ident, contrasena) => {
    const r = respuesta(await dispatch(login({ ident, contrasena })))
    if (r.user) { toast(`¡Hola, ${r.user.nombre}!`); return {} }
    if (r.verif) return { pendiente: true } // la cuenta no estaba confirmada: se abre la verificación
    return r
  }

  const registrarCuenta = async (valores) => {
    const r = respuesta(await dispatch(registrar(valores)))
    return r.verif ? {} : r
  }

  const cerrarSesion = () => {
    dispatch(logout())
    toast('Cerraste sesión')
  }

  // Confirmación del e-mail (la cuenta nueva o la que quedó sin confirmar)
  const verificacion = {
    usuario: verif && verif.cuenta,
    nota: verif ? verif.nota : '',
    reenviar: async () => respuesta(await dispatch(reenviarCodigo(verif.id))),
    confirmar: async (codigo) => {
      const r = respuesta(await dispatch(confirmarEmail({ id: verif.id, codigo })))
      if (r.user) { toast(`¡Cuenta confirmada! Hola, ${r.user.nombre}`); return {} }
      return r
    },
    cancelar: () => dispatch(cancelarVerificacion()),
  }

  const actualizarPerfil = async (valores, nuevoPerfil) => {
    const resultado = await dispatch(guardarPerfil({ valores, nuevoPerfil, user }))
    if (resultado.error) {
      dispatch(fetchUsuario(user.id)) // se vuelve a leer el perfil tal como quedó en el back
      throw new Error(resultado.error.message)
    }
    if (resultado.payload.sesionCerrada) {
      toast('Cambiaste tu e-mail: volvé a ingresar con el nuevo.')
      return { sesionCerrada: true }
    }
    toast('Perfil actualizado')
    return {}
  }

  const cambiarDirecciones = async (accion, aviso) => {
    const resultado = await dispatch(accion)
    if (resultado.error) { toast(resultado.error.message); return false }
    if (aviso) toast(aviso)
    return true
  }

  // `accion` = lo que el visitante quiso hacer ({ tipo: 'cart' | 'buy' | 'fav', idLibro }): se completa al volver logueado
  const requiereLogin = (tipo, destino = null, accion = null) => {
    if (user) return false
    dispatch(abrirGate({ tipo, destino, accion }))
    return true
  }

  const alternarMark = async (id) => {
    const estaba = marks.includes(id)
    toast(estaba ? 'Quitado de tu Marcapáginas' : 'Guardado en tu Marcapáginas')
    const resultado = await dispatch(toggleMark({ id, estaba }))
    if (resultado.error) toast(resultado.error.message) // el slice ya revirtió el cambio
  }

  const sacarMarks = (ids) => {
    const quitar = ids.filter((id) => marks.includes(id))
    if (quitar.length) dispatch(quitarMarks(quitar))
  }

  return {
    user, perfil, marks, direcciones, gate, gateDestino, pendiente, verificacion,
    login: iniciarSesion, registrar: registrarCuenta, logout: cerrarSesion, actualizarPerfil,
    agregarDireccion: (direccion) => cambiarDirecciones(crearDireccion({ user, direccion }), 'Dirección guardada'),
    eliminarDireccion: (id) => cambiarDirecciones(eliminarDireccion({ user, id })),
    marcarPrincipal: (id) => cambiarDirecciones(marcarPrincipal({ user, id }), 'Dirección principal actualizada'),
    requiereLogin,
    cerrarGate: ({ conservarAccion = false } = {}) => dispatch(cerrarGate({ conservarAccion })),
    limpiarPendiente: () => dispatch(limpiarPendiente()),
    toggleMark: alternarMark,
    quitarMarks: sacarMarks,
  }
}