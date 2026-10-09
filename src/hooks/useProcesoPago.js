import { useEffect, useRef, useState } from 'react'

// Muestra el estado de procesamiento mientras el back registra el pago.
const useProcesoPago = (alTerminar) => {
  const [procesando, setProcesando] = useState(false)
  const [nota, setNota] = useState('')
  const timer = useRef(null)
  const montado = useRef(true)

  useEffect(() => {
    montado.current = true
    return () => { montado.current = false; clearTimeout(timer.current) }
  }, [])

  const pagar = (proveedor) => {
    setNota('')
    setProcesando(true)
    timer.current = setTimeout(async () => {
      try {
        const resultado = await alTerminar(proveedor)
        if (montado.current && resultado === 'RECHAZADO') setNota('El pago fue rechazado. Probá con otro método o volvé a intentar: tus libros siguen reservados.')
      } catch (err) {
        if (montado.current) setNota(err.message || 'No pudimos procesar el pago. Intentá de nuevo.')
      } finally {
        if (montado.current) setProcesando(false)
      }
    }, 1600)
  }

  return { procesando, nota, pagar }
}

export default useProcesoPago
