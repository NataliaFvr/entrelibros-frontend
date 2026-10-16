import { useState } from 'react'

// Estado de interfaz de un formulario. El backend valida los datos y devuelve,
// cuando corresponde, los errores por campo que se muestran en la pantalla.
const useFormulario = (inicial) => {
  const [valores, setValores] = useState(inicial)
  const [aviso, setAviso] = useState({ mensaje: '', tipo: 'VALIDACION' })
  const [delServidor, setDelServidor] = useState({})

  const cambiar = (nombre, valor) => {
    setValores((v) => ({ ...v, [nombre]: valor }))
    // el error que mandó el servidor para este campo deja de valer apenas la persona lo corrige
    setDelServidor((s) => {
      if (!(nombre in s)) return s
      const resto = { ...s }
      delete resto[nombre]
      return resto
    })
  }

  const completar = (datos) => setValores((v) => ({ ...v, ...datos }))

  // `tipo` es el tipo de errorApi (CREDENCIALES, CODIGO_INVALIDO…): define el título y el color del <Aviso>
  const setError = (mensaje, tipo = 'VALIDACION') => setAviso({ mensaje, tipo })

  const reiniciar = () => {
    setValores(inicial)
    setAviso({ mensaje: '', tipo: 'VALIDACION' })
    setDelServidor({})
  }

  return {
    valores, cambiar, completar, reiniciar,
    error: aviso.mensaje, tipoError: aviso.tipo, setError,
    errores: delServidor, setErroresCampos: setDelServidor,
  }
}

export default useFormulario
