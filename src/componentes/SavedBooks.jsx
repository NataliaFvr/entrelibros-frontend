import {mostrarToast} from '../redux/toastSlice'
import { toggleMark as toggleMarkThunk } from '../redux/userSlice'
import { fetchLibro } from '../redux/librosSlice'
import {useDispatch,useSelector} from 'react-redux'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCompra } from '../hooks/useCompra'
import { useLibros } from '../hooks/useLibros'
import useLibroPropio from '../hooks/useLibroPropio'
import EmptyBlock from './EmptyBlock'
import SavedBook from './SavedBook'

// Pestaña Marcapáginas: los libros guardados, en el orden en que se guardaron
const SavedBooks = () => {
  const navigate = useNavigate()
  const dispatch=useDispatch()
  const {marks, user}=useSelector(s=>s.user)
  const sueltos = useSelector((state) => state.libros.sueltos)
  const toggleMark=async(i)=>{const estaba=marks.includes(i);const r=await dispatch(toggleMarkThunk({id:i,estaba}));if(r.error)toast(r.error.message)}
  const toast=(msg,accion)=>dispatch(mostrarToast({msg,accion}))
  const compraUser = useSelector((state) => state.user.user)
  const compraMarks = useSelector((state) => state.user.marks)
  const compraCarrito = useSelector((state) => state.carrito.items)
  const compraPedidos = useSelector((state) => state.pedidos.items)
  const { agregar } = useCompra({ dispatch, user: compraUser, marks: compraMarks, carrito: compraCarrito, pedidos: compraPedidos })
  const librosRedux = useSelector((state) => state.libros.items)
  const loadingRedux = useSelector((state) => state.libros.loading)
  const errorRedux = useSelector((state) => state.libros.error)
  const categoriasRedux = useSelector((state) => state.libros.categorias.items)
  const { libros } = useLibros({ libros: librosRedux, loading: loadingRedux, error: errorRedux, listaCategorias: categoriasRedux })
  const { esPropio } = useLibroPropio(user)

  const faltantesClave = marks
    .filter((id) => !libros.some((libro) => libro.id === id) && sueltos[id] === undefined)
    .join(',')
  useEffect(() => {
    if (!faltantesClave) return
    faltantesClave.split(',').forEach((id) => dispatch(fetchLibro(Number(id))))
  }, [dispatch, faltantesClave])

  const guardados = marks
    .map((id) => libros.find((l) => l.id === id) || sueltos[id])
    .filter(Boolean)

  if (!guardados.length) {
    return (
      <EmptyBlock titulo="Tu Marcapáginas está vacío" texto="Guardá libros con el botón de cada ficha para encontrarlos acá."
        boton="Ver libros" onClick={() => navigate('/libros')} />
    )
  }

  return (
    <div className="grid">
      {guardados.map((l) => (
        <SavedBook key={l.id} libro={l} propio={esPropio(l)} onAlCarrito={() => agregar(l)} onQuitar={() => toggleMark(l.id)} />
      ))}
    </div>
  )
}

export default SavedBooks
