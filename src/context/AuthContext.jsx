import { useEffect, useMemo, useState } from 'react'
import { AuthCtx } from './authCtx'
import { useToast } from '../hooks/useToast'
import useVerificacion from '../hooks/useVerificacion'
import { EVENTO_SESION_EXPIRADA } from '../api/axiosConfig'
import { cerrarSesionApi, getSesionApi, loginApi, reenviarCodigoApi, registrarApi, traerUsuarioApi } from '../api/authApi'
import { actualizarUsuarioApi, quitarFotoUsuarioApi, subirFotoUsuarioApi, urlFotoUsuario } from '../api/usuariosApi'
import { agregarMarcapaginaApi, listarMarcapaginasApi, quitarMarcapaginaApi } from '../api/cuentaApi'
import { dataUrlAFile } from '../api/adaptadores'
import { direcciones as servicioDirecciones } from '../api/direccionesApiExtra'
import LoginGate from '../componentes/LoginGate'
import { mensajeError, normalizarError } from '../utils/errorApi'

const AuthProvider = ({ children }) => {
  const toast = useToast()
  const [user, setUser] = useState(getSesionApi)
  const [marks, setMarks] = useState([])
  const perfil = useMemo(() => (user ? { avatar: user.avatar || '', foto: user.tieneFoto ? urlFotoUsuario(user.id) : '' } : {}), [user])
  const [direcciones, setDirecciones] = useState([])
  const [gate, setGate] = useState(null)
  const [gateDestino, setGateDestino] = useState(null)

  const entrar = (u, saludo) => {
    setUser(u)
    listarMarcapaginasApi().then(setMarks).catch(() => setMarks([]))
    setDirecciones([])
    toast(saludo || `¡Hola, ${u.nombre}!`)
  }

  useEffect(() => {
    if (!user) return undefined
    let vigente = true
    traerUsuarioApi(user.id).then((u) => { if (vigente) setUser(u) }).catch(() => {})
    listarMarcapaginasApi().then((ids) => { if (vigente) setMarks(ids) }).catch(() => {})
    return () => { vigente = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const claveCuenta = user ? `${user.id ?? ''}|${user.nombreUsuario}` : null
  useEffect(() => {
    if (!claveCuenta) return undefined
    let vigente = true
    servicioDirecciones.listar(user).then((lista) => { if (vigente) setDirecciones(lista) }).catch(() => {})
    return () => { vigente = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claveCuenta])

  const verificacion = useVerificacion((u) => entrar(u, `¡Cuenta confirmada! Hola, ${u.nombre}`))

  const login = async (ident, contrasena) => {
    try {
      try {
        entrar(await loginApi(ident, contrasena))
        return {}
      } catch (err) {
        const info = normalizarError(err, 'login')
        if (info.tipo !== 'CUENTA_NO_CONFIRMADA') return { error: info.mensaje, tipo: info.tipo, campos: info.campos }
        await reenviarCodigoApi(ident.trim()).catch(() => {})
        verificacion.iniciar({ email: ident.trim() }, 'Tu cuenta todavía no está confirmada. Te mandamos un código nuevo.')
        return { pendiente: true }
      }
    } catch (err) {
      const info = normalizarError(err, 'login')
      return { error: info.mensaje, tipo: info.tipo, campos: info.campos }
    }
  }

  const registrar = async (v) => {
    try {
      verificacion.iniciar(await registrarApi(v), 'Te creamos la cuenta. Falta un paso: confirmá tu e-mail.')
      return {}
    } catch (err) {
      const info = normalizarError(err, 'registro')
      return { error: info.mensaje, tipo: info.tipo, campos: info.campos }
    }
  }

  const logout = () => {
    cerrarSesionApi()
    setUser(null)
    setMarks([])
    setDirecciones([])
    toast('Cerraste sesión')
  }

  useEffect(() => {
    const alVencer = () => {
      cerrarSesionApi()
      setUser(null)
      setMarks([])
      setDirecciones([])
      toast('Tu sesión venció. Volvé a ingresar para continuar.')
    }
    window.addEventListener(EVENTO_SESION_EXPIRADA, alVencer)
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, alVencer)
  }, [toast])

  const actualizarPerfil = async (v, nuevoPerfil) => {
    const cambios = { nombre: v.nombre.trim(), apellido: v.apellido.trim(), nombreUsuario: v.nombreUsuario, email: v.email.trim() }
    if (v.pw) cambios.contrasena = v.pw
    const fotoNueva = typeof nuevoPerfil.foto === 'string' && nuevoPerfil.foto.startsWith('data:')
    const avatar = nuevoPerfil.foto ? '' : nuevoPerfil.avatar || ''
    if (avatar !== (user.avatar || '')) cambios.avatar = avatar
    let nuevo
    try {
      if (fotoNueva) await subirFotoUsuarioApi(user.id, await dataUrlAFile(nuevoPerfil.foto, 'perfil'))
      else if (!nuevoPerfil.foto && user.tieneFoto) await quitarFotoUsuarioApi(user.id)
      nuevo = await actualizarUsuarioApi(user.id, cambios)
    } catch (err) {
      traerUsuarioApi(user.id).then(setUser).catch(() => {})
      throw new Error(mensajeError(err, 'registro'))
    }
    if (nuevo.email !== user.email) {
      cerrarSesionApi()
      setUser(null)
      setMarks([])
      setDirecciones([])
      toast('Cambiaste tu e-mail: volvé a ingresar con el nuevo.')
      return { sesionCerrada: true }
    }
    setUser(nuevo)
    toast('Perfil actualizado')
    return {}
  }

  const cambiarDirecciones = async (llamar, aviso) => {
    try {
      setDirecciones(await llamar())
      if (aviso) toast(aviso)
      return true
    } catch (err) {
      toast(mensajeError(err))
      return false
    }
  }

  const agregarDireccion = (d) => cambiarDirecciones(() => servicioDirecciones.crear(user, d), 'Dirección guardada')
  const eliminarDireccion = (id) => cambiarDirecciones(() => servicioDirecciones.eliminar(user, id))
  const marcarPrincipal = (id) => cambiarDirecciones(() => servicioDirecciones.marcarPrincipal(user, id), 'Dirección principal actualizada')

  const requiereLogin = (tipo, destino = null) => {
    if (user) return false
    setGate(tipo)
    setGateDestino(destino)
    return true
  }
  const cerrarGate = () => { setGate(null); setGateDestino(null) }

  const toggleMark = async (id) => {
    const estaba = marks.includes(id)
    const nuevo = estaba ? marks.filter((x) => x !== id) : [...marks, id]
    setMarks(nuevo)
    toast(estaba ? 'Quitado de tu Marcapáginas' : 'Guardado en tu Marcapáginas')
    try {
      await (estaba ? quitarMarcapaginaApi(id) : agregarMarcapaginaApi(id))
    } catch (err) {
      setMarks(marks)
      toast(mensajeError(err))
    }
  }

  const quitarMarks = (ids) => {
    const nuevo = marks.filter((x) => !ids.includes(x))
    if (nuevo.length === marks.length) return
    setMarks(nuevo)
    ids.filter((id) => marks.includes(id)).forEach((id) => quitarMarcapaginaApi(id).catch(() => {}))
  }

  const value = {
    user, perfil, marks, direcciones, gate, gateDestino, verificacion,
    login, registrar, logout, actualizarPerfil, agregarDireccion, eliminarDireccion, marcarPrincipal,
    requiereLogin, cerrarGate, toggleMark, quitarMarks,
  }

  return <AuthCtx.Provider value={value}><>{children}<LoginGate /></></AuthCtx.Provider>
}

export default AuthProvider
