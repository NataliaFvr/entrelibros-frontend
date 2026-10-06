import { useEffect, useRef, useState } from 'react'

// Simula la pasarela: 1,6 s "procesando" y después aprueba o rechaza según `sim`.
// `alTerminar(proveedor, sim)` aplica el pago (puede ser async: con el back llama a POST /pagos).
// Si devuelve 'RECHAZADO' o lanza un error, el motivo se muestra en `nota` y los libros siguen reservados.
const useProcesoPago = (alTerminar) => {
  const [procesando, setProcesando] = useState(false)
  const [nota, setNota] = useState('')
  const timer = useRef(null)
  const montado = useRef(true)

  useEffect(() => {
    montado.current = true
    return () => { montado.current = false; clearTimeout(timer.current) }
  }, [])

  const pagar = (proveedor, sim) => {
    setNota('')
    setProcesando(true)
    timer.current = setTimeout(async () => {
      if (sim === 'RECHAZADO') {
        setProcesando(false)
        setNota('El pago fue rechazado (simulado). Probá con otro método o volvé a intentar: tus libros siguen reservados.')
        return
      }
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
