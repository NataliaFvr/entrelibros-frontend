import { mostrarToast } from '../redux/toastSlice'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { eliminarResenaLibro, eliminarResenaVendedor, fetchTodasResenas } from '../redux/resenasSlice'
import Aviso from './Aviso'
import EmptyBlock from './EmptyBlock'
import ReviewItem from './ReviewItem'

const AdminResenas = () => {
  const dispatch = useDispatch()
  const toast = (msg, accion) => dispatch(mostrarToast({ msg, accion }))
  const { todasLibro: libros, todasVendedor: vendedores, todasCargadas, errorTodas } = useSelector((state) => state.resenas)
  const [errorAccion, setErrorAccion] = useState('')
  const [eliminando, setEliminando] = useState(null)
  const cargando = !todasCargadas && !errorTodas
  const error = errorAccion || errorTodas || ''

  useEffect(() => {
    if (!todasCargadas) dispatch(fetchTodasResenas())
  }, [dispatch, todasCargadas])

  const cargar = () => { setErrorAccion(''); dispatch(fetchTodasResenas()) }

  const eliminar = async (tipo, id) => {
    setEliminando(`${tipo}:${id}`)
    setErrorAccion('')
    const resena = (tipo === 'libro' ? libros : vendedores).find((r) => r.id === id)
    const resultado = await dispatch(tipo === 'libro' ? eliminarResenaLibro(resena) : eliminarResenaVendedor(resena))
    setEliminando(null)
    if (resultado.error) setErrorAccion(resultado.error.message)
    else toast('Reseña eliminada')
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
