import { useMemo, useState } from 'react'
import { useAuth } from './useAuth'
import { useCompra } from './useCompra'
import { useLibros } from './useLibros'
import { useToast } from './useToast'
import { agregarResenaVendedor, getResenasVendedor } from '../services/resenasVendedorService'
import { estadoPago } from '../utils/pedidos'

// Reseñas de compradores de un vendedor + promedio. Solo puede reseñarlo quien le compró (pedido pagado);
// cada comprador tiene una única reseña por vendedor: si vuelve a publicar, se reemplaza.
const useResenasVendedor = (tienda) => {
  const { user } = useAuth()
  const { pedidos } = useCompra()
  const { libros } = useLibros()
  const toast = useToast()
  const [resenias, setResenias] = useState(() => getResenasVendedor(tienda))

  const promedio = useMemo(
    () => (resenias.length ? resenias.reduce((a, r) => a + r.st, 0) / resenias.length : 0),
    [resenias],
  )

  // Libros que esta persona ya le compró a este vendedor (los más recientes primero)
  const comprados = useMemo(
    () => pedidos
      .filter((p) => estadoPago(p) === 'SIMULADO_APROBADO')
      .flatMap((p) => p.its.map((i) => libros.find((l) => l.id === i.id)))
      .filter((l) => l && l.v === tienda),
    [pedidos, libros, tienda],
  )

  const miResena = user ? resenias.find((r) => r.u === user.nombreUsuario) || null : null
  const libroComprado = comprados.length ? comprados[0].t : ''

  const publicar = (st, texto) => {
    agregarResenaVendedor(tienda, {
      u: user.nombreUsuario, nc: `${user.nombre} ${user.apellido[0]}.`, st, t: texto, libro: libroComprado,
    })
    setResenias(getResenasVendedor(tienda))
    toast(miResena ? 'Reseña actualizada' : '¡Gracias por calificar al vendedor!')
  }

  return { resenias, promedio, miResena, libroComprado, puedeResenar: comprados.length > 0, publicar }
}

export default useResenasVendedor
