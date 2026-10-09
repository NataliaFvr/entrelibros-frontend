import { useState } from 'react'
import { normalizarError } from '../utils/errorApi'
import { reenviarCodigoApi, verificarEmailApi } from '../api/authApi'

const useVerificacion = (alConfirmar) => {
  const [verif, setVerif] = useState(null)
  const usuario = verif && verif.cuenta

  const iniciar = (u, nota) => setVerif({ id: u.email, nota, cuenta: { email: u.email, nombre: u.nombre || '' } })
  const reenviar = async () => {
    await reenviarCodigoApi(verif.id)
    setVerif({ ...verif, nota: 'Te enviamos un código nuevo.' })
  }
  const confirmar = async (codigo) => {
    try {
      const user = await verificarEmailApi(verif.id, codigo)
      setVerif(null)
      alConfirmar(user)
      return {}
    } catch (err) {
      const info = normalizarError(err, 'verificacion')
      return { error: info.mensaje, tipo: info.tipo, campos: info.campos }
    }
  }

  return { usuario, nota: verif ? verif.nota : '', iniciar, reenviar, confirmar, cancelar: () => setVerif(null) }
}

export default useVerificacion
