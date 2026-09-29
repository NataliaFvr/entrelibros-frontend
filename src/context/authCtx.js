import { createContext } from 'react'

export const AuthCtx = createContext({
  user: null, perfil: {}, cartCount: 0, marks: [], gate: null, verificacion: {},
  login: () => ({}), registrar: () => {}, logout: () => {}, actualizarPerfil: () => {},
  requiereLogin: () => false, cerrarGate: () => {}, toggleMark: () => {}, addToCart: () => {},
})
