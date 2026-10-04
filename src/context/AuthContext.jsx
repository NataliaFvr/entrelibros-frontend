import { useState } from 'react'
import { AuthCtx } from './authCtx'
import { useToast } from '../hooks/useToast'
import useVerificacion from '../hooks/useVerificacion'
import { guardar, leer, mover } from '../services/almacen'
import { actualizarUsuario, cerrarSesion, getSesion, iniciarSesion, registrar as crearCuenta } from '../services/authService'
import { claveCart, claveDir, claveMarks, clavePedidos, clavePerfil, claveVendedor } from '../services/claves'
import LoginGate from '../componentes/LoginGate'

const AuthProvider = ({ children }) => {
  const toast = useToast()
  const [user, setUser] = useState(getSesion)
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

  const verificacion = useVerificacion((u) => entrar(u, `¡Cuenta confirmada! Hola, ${u.nombre}`))

  // Devuelve { error }, { pendiente: true } (hay que confirmar el mail) o {} si entró bien
  const login = (ident, contrasena) => {
    const r = iniciarSesion(ident, contrasena)
    if (r.error) return { error: r.error }
    if (r.pendiente) {
      verificacion.iniciar(r.pendiente, 'Tu cuenta todavía no está confirmada. Te mandamos un código nuevo.')
      return { pendiente: true }
    }
    entrar(r.user)
    return {}
  }

  const registrar = (v) => {
    verificacion.iniciar(crearCuenta(v), 'Te creamos la cuenta. Falta un paso: confirmá tu e-mail.')
  }

  const logout = () => {
    cerrarSesion()
    setUser(null)
    setMarks([])
    setPerfil({})
    setDirecciones([])
    toast('Cerraste sesión')
  }

  // Guarda los datos del perfil; si cambió el usuario, lleva todo lo suyo a la clave nueva
  const actualizarPerfil = (v, nuevoPerfil) => {
    const cambios = { nombre: v.nombre.trim(), apellido: v.apellido.trim(), nombreUsuario: v.nombreUsuario, email: v.email.trim() }
    if (v.pw) cambios.contrasena = v.pw
    const nuevo = actualizarUsuario(user.nombreUsuario, cambios)
    if (nuevo.nombreUsuario !== user.nombreUsuario) {
      ;[claveMarks, claveCart, clavePerfil, claveDir, clavePedidos, claveVendedor].forEach((clave) => mover(clave(user), clave(nuevo)))
    }
    guardar(clavePerfil(nuevo), nuevoPerfil)
    setUser(nuevo)
    setPerfil(nuevoPerfil)
    toast('Perfil actualizado')
  }

  const agregarDireccion = (d) => {
    const nuevas = [...direcciones, d]
    setDirecciones(nuevas)
    guardar(claveDir(user), nuevas)
    toast('Dirección guardada')
  }

  const eliminarDireccion = (indice) => {
    const nuevas = direcciones.filter((_, i) => i !== indice)
    setDirecciones(nuevas)
    guardar(claveDir(user), nuevas)
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

  const toggleMark = (id) => {
    const nuevo = marks.includes(id) ? marks.filter((x) => x !== id) : [...marks, id]
    setMarks(nuevo)
    guardar(claveMarks(user), nuevo)
    toast(marks.includes(id) ? 'Quitado de tu Marcapáginas' : 'Guardado en tu Marcapáginas')
  }

  // Al comprar, el libro deja de ser un deseo: se saca del Marcapáginas sin avisar con toast
  const quitarMarks = (ids) => {
    const nuevo = marks.filter((x) => !ids.includes(x))
    if (nuevo.length === marks.length) return
    setMarks(nuevo)
    guardar(claveMarks(user), nuevo)
  }

  const value = {
    user, perfil, marks, direcciones, gate, gateDestino, verificacion,
    login, registrar, logout, actualizarPerfil, agregarDireccion, eliminarDireccion,
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
