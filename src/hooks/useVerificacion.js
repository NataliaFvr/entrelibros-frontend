import { useState } from 'react'
import { normalizarError } from '../utils/errorApi'
import { confirmarCodigo, generarCodigo, getUsuarios, marcarVerificada } from '../services/authService'
import { reenviarCodigoApi, verificarEmailApi } from '../api/authApi'
import { USAR_API } from '../utils/modoApi'

// Cuenta que está confirmando su e-mail. `alConfirmar(usuario)` se llama cuando queda confirmada.
// Modo demo: el código vive en este navegador. Modo API: el back manda el código por mail (POST /auth/register o
// /auth/reenviar-codigo-verificacion) y se confirma con POST /auth/verificar-email { email, codigo }, que devuelve los tokens.
const useVerificacion = (alConfirmar) => {
  const [verif, setVerif] = useState(null) // { id, nota, cuenta? } — en modo API `id` es el e-mail
  const usuario = verif && (USAR_API ? verif.cuenta : getUsuarios().find((u) => u.nombreUsuario === verif.id))

  // `nuevo` fuerza un código nuevo (si no, se reusa el vigente)
  const iniciar = (u, nota, nuevo = true) => {
    if (USAR_API) {
      setVerif({ id: u.email, nota, cuenta: { email: u.email, nombre: u.nombre || '' } })
      return
    }
    if (nuevo || !u.codigo || u.vence < Date.now()) generarCodigo(u.nombreUsuario)
    setVerif({ id: u.nombreUsuario, nota })
  }

  // Si falla, lanza el error: el formulario de código lo muestra
  const reenviar = async () => {
    if (USAR_API) await reenviarCodigoApi(verif.id)
    else generarCodigo(verif.id)
    setVerif({ ...verif, nota: 'Te enviamos un código nuevo.' })
  }

  // Devuelve { error, tipo, campos } (código inválido, vencido, usuario inexistente…) o {} si quedó confirmada
  const confirmar = async (codigo) => {
    try {
      const r = USAR_API ? { user: await verificarEmailApi(verif.id, codigo) } : await confirmarCodigo(verif.id, codigo)
      if (r.error) return { error: r.error, tipo: r.tipo }
      setVerif(null)
      alConfirmar(r.user)
      return {}
    } catch (err) {
      const info = normalizarError(err, 'verificacion')
      return { error: info.mensaje, tipo: info.tipo, campos: info.campos }
    }
  }

  const confirmarDesdeMail = () => {
    const u = marcarVerificada(verif.id)
    setVerif(null)
    alConfirmar(u)
  }

  return { usuario, nota: verif ? verif.nota : '', iniciar, reenviar, confirmar, confirmarDesdeMail, cancelar: () => setVerif(null) }
}

export default useVerificacion
