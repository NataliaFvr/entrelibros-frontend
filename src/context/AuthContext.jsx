import { useState } from 'react'
import { AuthCtx } from './authCtx'
import { useToast } from '../hooks/useToast'
import useVerificacion from '../hooks/useVerificacion'
import { guardar, leer, mover } from '../services/almacen'
import { actualizarUsuario, cerrarSesion, getSesion, iniciarSesion, registrar as crearCuenta } from '../services/authService'
import LoginGate from '../componentes/LoginGate'

const claveMarks = (u) => `entrelibros_marcapaginas_${u.nombreUsuario}`
const claveCart = (u) => `entrelibros_cart_${u.nombreUsuario}`
const clavePerfil = (u) => `entrelibros_perfil_${u.nombreUsuario}` // { avatar, foto }

const AuthProvider = ({ children }) => {
  const toast = useToast()
  const [user, setUser] = useState(getSesion)
  const [marks, setMarks] = useState(() => (user ? leer(claveMarks(user), []) : []))
  const [cart, setCart] = useState(() => (user ? leer(claveCart(user), []) : []))
  const [perfil, setPerfil] = useState(() => (user ? leer(clavePerfil(user), {}) : {}))
  const [gate, setGate] = useState(null) // null = cerrado, si no: 'cart' | 'fav' | 'review' | 'sell'

  const entrar = (u, saludo) => {
    setUser(u)
    setMarks(leer(claveMarks(u), []))
    setCart(leer(claveCart(u), []))
    setPerfil(leer(clavePerfil(u), {}))
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
    setCart([])
    setPerfil({})
    toast('Cerraste sesión')
  }

  // Guarda los datos del perfil; si cambió el usuario, lleva marcapáginas, carrito y avatar a la clave nueva
  const actualizarPerfil = (v, nuevoPerfil) => {
    const cambios = { nombre: v.nombre.trim(), apellido: v.apellido.trim(), nombreUsuario: v.nombreUsuario, email: v.email.trim() }
    if (v.pw) cambios.contrasena = v.pw
    const nuevo = actualizarUsuario(user.nombreUsuario, cambios)
    if (nuevo.nombreUsuario !== user.nombreUsuario) {
      ;[claveMarks, claveCart, clavePerfil].forEach((clave) => mover(clave(user), clave(nuevo)))
    }
    guardar(clavePerfil(nuevo), nuevoPerfil)
    setUser(nuevo)
    setPerfil(nuevoPerfil)
    toast('Perfil actualizado')
  }

  // Corta la acción y muestra el modal si no hay sesión (true = hay que loguearse)
  const requiereLogin = (tipo) => {
    if (user) return false
    setGate(tipo)
    return true
  }

  const toggleMark = (id) => {
    const nuevo = marks.includes(id) ? marks.filter((x) => x !== id) : [...marks, id]
    setMarks(nuevo)
    guardar(claveMarks(user), nuevo)
    toast(marks.includes(id) ? 'Quitado de tu Marcapáginas' : 'Guardado en tu Marcapáginas')
  }

  // Los usados tienen 1 unidad; los nuevos, hasta 10 por compra
  const addToCart = (libro) => {
    const tope = libro.usado ? 1 : 10
    const hay = cart.find((c) => c.id === libro.id)
    const nuevo = hay
      ? cart.map((c) => (c.id === libro.id ? { ...c, q: Math.min(c.q + 1, tope) } : c))
      : [...cart, { id: libro.id, q: 1 }]
    setCart(nuevo)
    guardar(claveCart(user), nuevo)
    toast('Agregado al carrito')
  }

  const value = {
    user, perfil, marks, gate, verificacion, cartCount: cart.reduce((n, c) => n + c.q, 0),
    login, registrar, logout, actualizarPerfil, requiereLogin, cerrarGate: () => setGate(null), toggleMark, addToCart,
  }

  return (
    <AuthCtx.Provider value={value}>
      {children}
      <LoginGate />
    </AuthCtx.Provider>
  )
}

export default AuthProvider
