import { useAuth } from './useAuth'
import { useToast } from './useToast'

// Entra con una de las cuentas de prueba (ver data/cuentasDemo.js).
// `elegirDestino(ruta)` avisa a la página adónde ir ANTES de iniciar sesión: así el redireccionamiento
// automático de AuthPage (que se dispara apenas hay usuario) ya usa la ruta correcta.
const useIngresoDemo = (elegirDestino) => {
  const { login } = useAuth()
  const toast = useToast()

  return async ({ ident, contrasena, destino }) => {
    elegirDestino(destino)
    const r = await login(ident, contrasena)
    if (r.error) {
      elegirDestino(null)
      toast('No se pudo entrar con la cuenta de prueba. Probá ingresando a mano.')
    }
  }
}

export default useIngresoDemo
