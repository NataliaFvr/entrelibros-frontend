import { createContext } from 'react'

export const AuthCtx = createContext({
  user: null, perfil: {}, marks: [], direcciones: [], gate: null, gateDestino: null, verificacion: {},
  login: async () => ({}), registrar: async () => ({}), logout: () => {}, actualizarPerfil: () => {},
  agregarDireccion: () => {}, eliminarDireccion: () => {}, marcarPrincipal: () => {},
  requiereLogin: () => false, cerrarGate: () => {}, toggleMark: () => {}, quitarMarks: () => {},
})
