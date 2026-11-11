import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { urlFotoUsuario } from '../api/usuariosApi'
import {
    abrirGate, cancelarVerificacion, cerrarGate, confirmarEmail, crearDireccion, eliminarDireccion, fetchUsuario, guardarPerfil,
    limpiarPendiente, login, logout, marcarPrincipal, NOTA_SIN_CONFIRMAR, quitarMarks,
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

  // Si la acción terminó en `rejected`, los formularios reciben { error, tipo, campos } para mostrar qué pasó
  const errorDe = (resultado) => ({ error: resultado.error.message, tipo: resultado.error.tipo, campos: resultado.error.campos || {} })

  const iniciarSesion = async (ident, contrasena) => {
    const resultado = await dispatch(login({ ident, contrasena }))
    if (!resultado.error) { toast(`¡Hola, ${resultado.payload.nombre}!`); return {} }
    // La cuenta no estaba confirmada: el slice ya abrió la verificación; acá se pide un código nuevo
    if (resultado.error.tipo === 'CUENTA_NO_CONFIRMADA') {
      dispatch(reenviarCodigo({ email: ident.trim(), nota: NOTA_SIN_CONFIRMAR }))
      return { pendiente: true }
    }
    return errorDe(resultado)
  }

  const registrarCuenta = async (valores) => {
    const resultado = await dispatch(registrar(valores))
    return resultado.error ? errorDe(resultado) : {}
  }

  const cerrarSesion = () => {
    dispatch(logout())
    toast('Cerraste sesión')
  }

  // Confirmación del e-mail (la cuenta nueva o la que quedó sin confirmar)
  const verificacion = {
    usuario: verif && verif.cuenta,
    nota: verif ? verif.nota : '',
    reenviar: async () => {
      const resultado = await dispatch(reenviarCodigo({ email: verif.id }))
      return resultado.error ? errorDe(resultado) : {}
    },
    confirmar: async (codigo) => {
      const resultado = await dispatch(confirmarEmail({ email: verif.id, codigo }))
      if (resultado.error) return errorDe(resultado)
      toast(`¡Cuenta confirmada! Hola, ${resultado.payload.nombre}`)
      return {}
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
    agregarDireccion: (direccion) => cambiarDirecciones(crearDireccion(direccion), 'Dirección guardada'),
    eliminarDireccion: (id) => cambiarDirecciones(eliminarDireccion(id)),
    marcarPrincipal: (id) => cambiarDirecciones(marcarPrincipal(id), 'Dirección principal actualizada'),
    requiereLogin,
    cerrarGate: ({ conservarAccion = false } = {}) => dispatch(cerrarGate({ conservarAccion })),
    limpiarPendiente: () => dispatch(limpiarPendiente()),
    toggleMark: alternarMark,
    quitarMarks: sacarMarks,
  }
}