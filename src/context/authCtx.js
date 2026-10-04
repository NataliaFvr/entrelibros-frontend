import { createContext } from 'react'

export const AuthCtx = createContext({
  user: null, perfil: {}, marks: [], direcciones: [], gate: null, verificacion: {},
  login: () => ({}), registrar: () => {}, logout: () => {}, actualizarPerfil: () => {},
  agregarDireccion: () => {}, eliminarDireccion: () => {},
  requiereLogin: () => false, cerrarGate: () => {}, toggleMark: () => {}, quitarMarks: () => {},
})
