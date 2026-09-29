import { createContext } from 'react'

export const AuthCtx = createContext({
  user: null, cartCount: 0, marks: [], gate: null,
  login: () => '', registrar: () => {}, logout: () => {},
  requiereLogin: () => false, cerrarGate: () => {}, toggleMark: () => {}, addToCart: () => {},
})
