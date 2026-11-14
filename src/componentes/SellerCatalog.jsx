/* oxlint-disable no-unused-vars */
import { abrirGate,cerrarGate as cerrarGateAction,cancelarVerificacion,confirmarEmail,crearDireccion,eliminarDireccion as eliminarDireccionThunk,fetchUsuario,guardarPerfil,limpiarPendiente as limpiarPendienteAction,login as loginThunk,logout as logoutThunk,marcarPrincipal as marcarPrincipalThunk,NOTA_SIN_CONFIRMAR,quitarMarks as quitarMarksThunk,reenviarCodigo,registrar as registrarThunk,toggleMark as toggleMarkThunk } from '../redux/authSlice'
import {useDispatch,useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useCompra } from '../hooks/useCompra'
import ProductCard from './ProductCard'
import EmptyBlock from './EmptyBlock'

// Catálogo público: libros activos del vendedor (nuevos y usados), cada uno con botón de compra
const SellerCatalog = ({ tienda, libros }) => {
  const navigate = useNavigate()
  const dispatch=useDispatch()

  const requiereLogin=(t,d=null,a=null)=>{if(user)return false;dispatch(abrirGate({tipo:t,destino:d,accion:a}));return true}
  const { agregar } = useCompra()

  const comprar = async (libro) => {
    if (requiereLogin('cart')) return
    if (await agregar(libro)) navigate('/carrito') // con el back espera a que el libro esté en el carrito
  }
  const alCarrito = (libro) => { if (!requiereLogin('cart')) agregar(libro) }

  return (
    <section className="dsec" id="catalogo">
      <h2>Libros de {tienda}</h2>
      {libros.length ? (
        <div className="grid">
          {libros.map((l) => (
            <div key={l.id} className="sp-book">
              <ProductCard libro={l} />
              <div className="sp-book-act">
                <button className="btn main" type="button" onClick={() => comprar(l)}>Comprar ahora</button>
                <button className="lnk" type="button" onClick={() => alCarrito(l)}>Añadir a mi estantería</button>
              </div>
            </div>
          ))}
        </div>
      ) : <EmptyBlock titulo="Sin libros a la venta" texto="Este vendedor no tiene libros activos en este momento." />}
    </section>
  )
}

export default SellerCatalog
