import { useEffect, useState } from 'react'
import { AuthCtx } from './authCtx'
import { useToast } from '../hooks/useToast'
import useVerificacion from '../hooks/useVerificacion'
import { guardar, leer, mover } from '../services/almacen'
import { actualizarUsuario, cerrarSesion, getSesion, iniciarSesion, registrar as crearCuenta } from '../services/authService'
import { EVENTO_SESION_EXPIRADA } from '../api/axiosConfig'
import { cerrarSesionApi, getSesionApi, loginApi, reenviarCodigoApi, registrarApi, traerUsuarioApi } from '../api/authApi'
import { actualizarUsuarioApi } from '../api/usuariosApi'
import { agregarMarcapaginaApi, listarMarcapaginasApi, quitarMarcapaginaApi } from '../api/cuentaApi'
import { USAR_API } from '../utils/modoApi'
import { claveCart, claveDir, claveMarks, claveNotifs, clavePedidos, clavePerfil, claveVendedor } from '../services/claves'
import LoginGate from '../componentes/LoginGate'
import { conPrincipal } from '../utils/direcciones'
import { mensajeError, normalizarError } from '../utils/errorApi'

// Cierra la sesión guardada: la del back (tokens) o la de demostración
const cerrarSesionGuardada = USAR_API ? cerrarSesionApi : cerrarSesion

const AuthProvider = ({ children }) => {
  const toast = useToast()
  const [user, setUser] = useState(USAR_API ? getSesionApi : getSesion)
  const [marks, setMarks] = useState(() => (user ? leer(claveMarks(user), []) : []))
  const [perfil, setPerfil] = useState(() => (user ? leer(clavePerfil(user), {}) : {}))
  const [direcciones, setDirecciones] = useState(() => (user ? leer(claveDir(user), []) : []))
  const [gate, setGate] = useState(null) // null = cerrado, si no: 'cart' | 'fav' | 'review' | 'sell' | 'account'
  const [gateDestino, setGateDestino] = useState(null) // adónde ir al entrar (null = volver a la página actual)

  const entrar = (u, saludo) => {
    setUser(u)
    setMarks(leer(claveMarks(u), []))
    setPerfil(leer(clavePerfil(u), {}))
    setDirecciones(leer(claveDir(u), []))
    toast(saludo || `¡Hola, ${u.nombre}!`)
  }

  // Con el back: al abrir la app (o al entrar) se vuelven a pedir el usuario (su rol o solicitud pudo cambiar) y su Marcapáginas
  const idApi = USAR_API && user ? user.id : null
  useEffect(() => {
    if (!idApi) return undefined
    let vigente = true
    traerUsuarioApi(idApi).then((u) => { if (vigente) setUser(u) }).catch(() => {})
    listarMarcapaginasApi().then((ids) => { if (vigente) setMarks(ids) }).catch(() => {})
    return () => { vigente = false }
  }, [idApi])

  const verificacion = useVerificacion((u) => entrar(u, `¡Cuenta confirmada! Hola, ${u.nombre}`))

  // Devuelve { error, tipo, campos }, { pendiente: true } (hay que confirmar el mail) o {} si entró bien.
  // Es async: hoy `iniciarSesion` responde al instante (demo), pero cuando llame a la API cualquier error HTTP
  // (400, 401, 403, 404…) llega acá como excepción y se traduce con normalizarError().
  const login = async (ident, contrasena) => {
    try {
      if (USAR_API) {
        // POST /auth/login { email, contrasena }. Una cuenta sin verificar responde 403 "email_no_verificado".
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
      }
      const r = await iniciarSesion(ident, contrasena)
      if (r.error) return { error: r.error, tipo: r.tipo }
      if (r.pendiente) {
        verificacion.iniciar(r.pendiente, 'Tu cuenta todavía no está confirmada. Te mandamos un código nuevo.')
        return { pendiente: true }
      }
      entrar(r.user)
      return {}
    } catch (err) {
      const info = normalizarError(err, 'login')
      return { error: info.mensaje, tipo: info.tipo, campos: info.campos }
    }
  }

  // Devuelve {} si la cuenta se creó (queda pendiente de confirmar) o { error, tipo, campos }
  const registrar = async (v) => {
    try {
      verificacion.iniciar(await (USAR_API ? registrarApi(v) : crearCuenta(v)), 'Te creamos la cuenta. Falta un paso: confirmá tu e-mail.')
      return {}
    } catch (err) {
      const info = normalizarError(err, 'registro')
      return { error: info.mensaje, tipo: info.tipo, campos: info.campos }
    }
  }

  const logout = () => {
    cerrarSesionGuardada()
    setUser(null)
    setMarks([])
    setPerfil({})
    setDirecciones([])
    toast('Cerraste sesión')
  }

  // axiosConfig avisa cuando la API responde 401 con un token guardado: se cierra la sesión y se avisa
  useEffect(() => {
    const alVencer = () => {
      cerrarSesionGuardada()
      setUser(null)
      setMarks([])
      setPerfil({})
      setDirecciones([])
      toast('Tu sesión venció. Volvé a ingresar para continuar.')
    }
    window.addEventListener(EVENTO_SESION_EXPIRADA, alVencer)
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, alVencer)
  }, [toast])

  // Con el back: PATCH /usuarios/{id}. El token del back lleva el e-mail: si cambia, hay que volver a ingresar.
  const actualizarPerfilApi = async (v, nuevoPerfil) => {
    const cambios = { nombre: v.nombre.trim(), apellido: v.apellido.trim(), nombreUsuario: v.nombreUsuario, email: v.email.trim() }
    if (v.pw) cambios.contrasena = v.pw
    let nuevo
    try {
      nuevo = await actualizarUsuarioApi(user.id, cambios)
    } catch (err) {
      throw new Error(mensajeError(err, 'registro'))
    }
    if (nuevo.nombreUsuario !== user.nombreUsuario) {
      ;[claveMarks, claveCart, clavePerfil, claveDir, clavePedidos, claveVendedor, claveNotifs].forEach((clave) => mover(clave(user), clave(nuevo)))
    }
    guardar(clavePerfil(nuevo), nuevoPerfil)
    setPerfil(nuevoPerfil)
    if (nuevo.email !== user.email) {
      logout()
      toast('Cambiaste tu e-mail: volvé a ingresar con el nuevo.')
      return
    }
    setUser(nuevo)
    toast('Perfil actualizado')
  }

  // Guarda los datos del perfil; si cambió el usuario, lleva todo lo suyo a la clave nueva
  const actualizarPerfil = (v, nuevoPerfil) => {
    if (USAR_API) return actualizarPerfilApi(v, nuevoPerfil)
    const cambios = { nombre: v.nombre.trim(), apellido: v.apellido.trim(), nombreUsuario: v.nombreUsuario, email: v.email.trim() }
    if (v.pw) cambios.contrasena = v.pw
    const nuevo = actualizarUsuario(user.nombreUsuario, cambios)
    if (nuevo.nombreUsuario !== user.nombreUsuario) {
      ;[claveMarks, claveCart, clavePerfil, claveDir, clavePedidos, claveVendedor, claveNotifs].forEach((clave) => mover(clave(user), clave(nuevo)))
    }
    guardar(clavePerfil(nuevo), nuevoPerfil)
    setUser(nuevo)
    setPerfil(nuevoPerfil)
    toast('Perfil actualizado')
  }

  const agregarDireccion = (d) => {
    const nuevas = conPrincipal([...direcciones, d])
    setDirecciones(nuevas)
    guardar(claveDir(user), nuevas)
    toast('Dirección guardada')
  }

  const eliminarDireccion = (indice) => {
    const nuevas = conPrincipal(direcciones.filter((_, i) => i !== indice))
    setDirecciones(nuevas)
    guardar(claveDir(user), nuevas)
  }

  const marcarPrincipal = (indice) => {
    const nuevas = direcciones.map((d, i) => ({ ...d, principal: i === indice }))
    setDirecciones(nuevas)
    guardar(claveDir(user), nuevas)
    toast('Dirección principal actualizada')
  }

  // Corta la acción y muestra el modal si no hay sesión (true = hay que loguearse).
  // `destino` (opcional): ruta a la que ir después de entrar.
  const requiereLogin = (tipo, destino = null) => {
    if (user) return false
    setGate(tipo)
    setGateDestino(destino)
    return true
  }

  const cerrarGate = () => {
    setGate(null)
    setGateDestino(null)
  }

  const toggleMark = async (id) => {
    const estaba = marks.includes(id)
    const nuevo = estaba ? marks.filter((x) => x !== id) : [...marks, id]
    setMarks(nuevo)
    guardar(claveMarks(user), nuevo)
    toast(estaba ? 'Quitado de tu Marcapáginas' : 'Guardado en tu Marcapáginas')
    if (!USAR_API) return
    // POST /marcapaginas { idLibro } · DELETE /marcapaginas/{idLibro}. Si el back falla se deshace el cambio.
    try {
      await (estaba ? quitarMarcapaginaApi(id) : agregarMarcapaginaApi(id))
    } catch (err) {
      setMarks(marks)
      guardar(claveMarks(user), marks)
      toast(mensajeError(err))
    }
  }

  // Al comprar, el libro deja de ser un deseo: se saca del Marcapáginas sin avisar con toast
  const quitarMarks = (ids) => {
    const nuevo = marks.filter((x) => !ids.includes(x))
    if (nuevo.length === marks.length) return
    setMarks(nuevo)
    guardar(claveMarks(user), nuevo)
    if (USAR_API) ids.filter((id) => marks.includes(id)).forEach((id) => quitarMarcapaginaApi(id).catch(() => {}))
  }

  const value = {
    user, perfil, marks, direcciones, gate, gateDestino, verificacion,
    login, registrar, logout, actualizarPerfil, agregarDireccion, eliminarDireccion, marcarPrincipal,
    requiereLogin, cerrarGate, toggleMark, quitarMarks,
  }

  return (
    <AuthCtx.Provider value={value}>
      {children}
      <LoginGate />
    </AuthCtx.Provider>
  )
}

export default AuthProvider
