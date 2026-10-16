import { useCallback, useEffect, useState } from 'react'
import {
  eliminarResenaLibroApi, eliminarResenaVendedorApi, getTodasResenasLibroApi, getTodasResenasVendedorApi,
} from '../api/resenasApi'
import { mensajeError } from '../utils/errorApi'
import { useToast } from '../hooks/useToast'
import Aviso from './Aviso'
import EmptyBlock from './EmptyBlock'
import ReviewItem from './ReviewItem'

const AdminResenas = () => {
  const toast = useToast()
  const [libros, setLibros] = useState([])
  const [vendedores, setVendedores] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [eliminando, setEliminando] = useState(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const [resenasLibro, resenasVendedor] = await Promise.all([
        getTodasResenasLibroApi(), getTodasResenasVendedorApi(),
      ])
      setLibros(resenasLibro)
      setVendedores(resenasVendedor)
      setError('')
    } catch (err) {
      setError(mensajeError(err, 'registro'))
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    let vigente = true
    Promise.all([getTodasResenasLibroApi(), getTodasResenasVendedorApi()])
      .then(([resenasLibro, resenasVendedor]) => {
        if (!vigente) return
        setLibros(resenasLibro)
        setVendedores(resenasVendedor)
      })
      .catch((err) => { if (vigente) setError(mensajeError(err, 'registro')) })
      .finally(() => { if (vigente) setCargando(false) })
    return () => { vigente = false }
  }, [])

  const eliminar = async (tipo, id) => {
    const clave = `${tipo}:${id}`
    setEliminando(clave)
    setError('')
    try {
      if (tipo === 'libro') {
        await eliminarResenaLibroApi(id)
        setLibros((actuales) => actuales.filter((resena) => resena.id !== id))
      } else {
        await eliminarResenaVendedorApi(id)
        setVendedores((actuales) => actuales.filter((resena) => resena.id !== id))
      }
      toast('Reseña eliminada')
    } catch (err) {
      setError(mensajeError(err, 'registro'))
    } finally {
      setEliminando(null)
    }
  }

  if (cargando) return <p className="sell-note" role="status">Cargando reseñas…</p>

  return (
    <div>
      {error && (
        <div className="mod-error">
          <Aviso mensaje={error} tipo="SERVIDOR" />
          <button className="lnk" type="button" onClick={cargar}>Reintentar</button>
        </div>
      )}
      {!error && !libros.length && !vendedores.length
        ? <EmptyBlock titulo="No hay reseñas para moderar" texto="Las reseñas de libros y vendedores aparecerán acá." />
        : (libros.length || vendedores.length) && (
          <div className="mod-reviews">
            <section className="card">
              <h2 className="fr">Reseñas de libros ({libros.length})</h2>
              {libros.length
                ? libros.map((resenia) => (
                  <ReviewItem key={`libro-${resenia.id}`} resenia={resenia} moderable
                    eliminando={eliminando === `libro:${resenia.id}`}
                    onEliminar={(id) => eliminar('libro', id)} />
                ))
                : <p>No hay reseñas de libros.</p>}
            </section>
            <section className="card">
              <h2 className="fr">Reseñas de vendedores ({vendedores.length})</h2>
              {vendedores.length
                ? vendedores.map((resenia) => (
                  <ReviewItem key={`vendedor-${resenia.id}`} resenia={resenia} moderable
                    eliminando={eliminando === `vendedor:${resenia.id}`}
                    onEliminar={(id) => eliminar('vendedor', id)} />
                ))
                : <p>No hay reseñas de vendedores.</p>}
            </section>
          </div>
        )}
    </div>
  )
}

export default AdminResenas
