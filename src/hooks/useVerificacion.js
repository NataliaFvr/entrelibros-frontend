import { useState } from 'react'
import { normalizarError } from '../utils/errorApi'
import { confirmarCodigo, generarCodigo, getUsuarios, marcarVerificada } from '../services/authService'

// Cuenta que está confirmando su e-mail. `alConfirmar(usuario)` se llama cuando queda confirmada.
const useVerificacion = (alConfirmar) => {
  const [verif, setVerif] = useState(null) // { id, nota }
  const usuario = verif && getUsuarios().find((u) => u.nombreUsuario === verif.id)

  // `nuevo` fuerza un código nuevo (si no, se reusa el vigente)
  const iniciar = (u, nota, nuevo = true) => {
    if (nuevo || !u.codigo || u.vence < Date.now()) generarCodigo(u.nombreUsuario)
    setVerif({ id: u.nombreUsuario, nota })
  }

  const reenviar = () => {
    generarCodigo(verif.id)
    setVerif({ id: verif.id, nota: 'Te enviamos un código nuevo.' })
  }

  // Devuelve { error, tipo, campos } (código inválido, vencido, usuario inexistente…) o {} si quedó confirmada
  const confirmar = async (codigo) => {
    try {
      const r = await confirmarCodigo(verif.id, codigo)
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
