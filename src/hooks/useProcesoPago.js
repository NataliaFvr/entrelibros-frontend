import { useEffect, useRef, useState } from 'react'

// Simula la pasarela: 1,6 s "procesando" y después aprueba o rechaza según `sim`.
// `alTerminar(proveedor, sim)` aplica el pago; devuelve true si quedó aprobado.
const useProcesoPago = (alTerminar) => {
  const [procesando, setProcesando] = useState(false)
  const [nota, setNota] = useState('')
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const pagar = (proveedor, sim) => {
    setNota('')
    setProcesando(true)
    timer.current = setTimeout(() => {
      setProcesando(false)
      if (sim === 'RECHAZADO') setNota('El pago fue rechazado (simulado). Probá con otro método o volvé a intentar: tus libros siguen reservados.')
      else alTerminar(proveedor)
    }, 1600)
  }

  return { procesando, nota, pagar }
}

export default useProcesoPago
