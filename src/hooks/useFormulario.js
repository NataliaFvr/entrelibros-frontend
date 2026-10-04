import { useState } from 'react'

// Estado de un formulario: valores, errores por campo y un aviso general.
// - validadores: { campo: (valor, valores) => mensaje | '' }. El error de un campo se muestra recién cuando el campo
//   fue "tocado" (se salió de él, o está en `enVivo` y se escribió), así no se marca en rojo algo que aún no se escribió.
// - enVivo: campos que se validan mientras se escribe (año, precio, descuento, contraseña…).
// - errores: lo que hay que pintar en cada input = errores de validación + errores que devolvió la API por campo.
// Sin validadores se comporta como siempre: { valores, cambiar, error, setError }.
const useFormulario = (inicial, validadores = {}, { enVivo = [] } = {}) => {
  const [valores, setValores] = useState(inicial)
  const [aviso, setAviso] = useState({ mensaje: '', tipo: 'VALIDACION' })
  const [tocados, setTocados] = useState({})
  const [delServidor, setDelServidor] = useState({})

  const marcar = (nombre) => setTocados((t) => (t[nombre] ? t : { ...t, [nombre]: true }))

  const cambiar = (nombre, valor) => {
    setValores((v) => ({ ...v, [nombre]: valor }))
    if (enVivo.includes(nombre)) marcar(nombre)
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

  const erroresDe = (v) => {
    const malos = {}
    Object.entries(validadores).forEach(([campo, validar]) => {
      const mensaje = validar(v[campo], v)
      if (mensaje) malos[campo] = mensaje
    })
    return malos
  }

  const errores = {}
  Object.entries(erroresDe(valores)).forEach(([campo, mensaje]) => { if (tocados[campo]) errores[campo] = mensaje })
  Object.assign(errores, delServidor)

  // Al enviar: marca todos los campos, enfoca el primero con error y devuelve { campo: mensaje } (vacío = todo bien)
  const validarTodo = (formulario) => {
    const malos = erroresDe(valores)
    setTocados(Object.fromEntries(Object.keys(validadores).map((c) => [c, true])))
    const primero = Object.keys(malos)[0]
    if (primero && formulario && formulario.elements && formulario.elements[primero]) formulario.elements[primero].focus()
    return malos
  }

  const reiniciar = () => {
    setValores(inicial)
    setAviso({ mensaje: '', tipo: 'VALIDACION' })
    setTocados({})
    setDelServidor({})
  }

  return {
    valores, cambiar, completar, reiniciar,
    error: aviso.mensaje, tipoError: aviso.tipo, setError,
    errores, alSalir: marcar, validarTodo, setErroresCampos: setDelServidor,
  }
}

export default useFormulario
