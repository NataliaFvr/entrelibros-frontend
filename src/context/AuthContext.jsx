import { useState } from 'react'
import { AuthCtx } from './authCtx'
import { useToast } from '../hooks/useToast'
import { guardar, leer } from '../services/almacen'
import { cerrarSesion, getSesion, iniciarSesion, registrar as crearCuenta } from '../services/authService'
import LoginGate from '../componentes/LoginGate'

const claveMarks = (u) => `entrelibros_marcapaginas_${u.nombreUsuario}`
const claveCart = (u) => `entrelibros_cart_${u.nombreUsuario}`

const AuthProvider = ({ children }) => {
  const toast = useToast()
  const [user, setUser] = useState(getSesion)
  const [marks, setMarks] = useState(() => (user ? leer(claveMarks(user), []) : []))
  const [cart, setCart] = useState(() => (user ? leer(claveCart(user), []) : []))
  const [gate, setGate] = useState(null) // null = cerrado, si no: 'cart' | 'fav' | 'review' | 'sell'

  const entrar = (u) => {
    setUser(u)
    setMarks(leer(claveMarks(u), []))
    setCart(leer(claveCart(u), []))
    toast(`¡Hola, ${u.nombre}!`)
  }

  // Devuelve el mensaje de error, o '' si entró bien
  const login = (ident, contrasena) => {
    const r = iniciarSesion(ident, contrasena)
    if (r.error) return r.error
    entrar(r.user)
    return ''
  }

  const registrar = (v) => entrar(crearCuenta(v))

  const logout = () => {
    cerrarSesion()
    setUser(null)
    setMarks([])
    setCart([])
    toast('Cerraste sesión')
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
    user, marks, gate, cartCount: cart.reduce((n, c) => n + c.q, 0),
    login, registrar, logout, requiereLogin, cerrarGate: () => setGate(null), toggleMark, addToCart,
  }

  return (
    <AuthCtx.Provider value={value}>
      {children}
      <LoginGate />
    </AuthCtx.Provider>
  )
}

export default AuthProvider
