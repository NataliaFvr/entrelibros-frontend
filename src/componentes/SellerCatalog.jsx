import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCompra } from '../hooks/useCompra'
import ProductCard from './ProductCard'
import EmptyBlock from './EmptyBlock'

// Catálogo público: libros activos del vendedor (nuevos y usados), cada uno con botón de compra
const SellerCatalog = ({ tienda, libros }) => {
  const navigate = useNavigate()
  const { requiereLogin } = useAuth()
  const { agregar } = useCompra()

  const comprar = (libro) => {
    if (requiereLogin('cart')) return
    agregar(libro)
    navigate('/carrito')
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
