import { useEffect, useMemo, useState } from 'react'
import { useAuth } from './useAuth'
import { useCompra } from './useCompra'
import { useLibros } from './useLibros'
import { useToast } from './useToast'
import { crearResenaVendedorApi, getResenasVendedorApi, modificarResenaVendedorApi } from '../api/resenasApi'
import { pagosDeOrdenApi } from '../api/comprasApi'
import { mensajeError } from '../utils/errorApi'
import { estadoPago } from '../utils/pedidos'

// Reseñas de compradores de un vendedor + promedio. Solo puede reseñarlo un usuario con rol COMPRADOR que ya le compró
// (pedido pagado) y que no sea el dueño de la tienda. Cada comprador tiene una única reseña por vendedor: si vuelve a publicar, se reemplaza.
// Con el back: GET /resenas-vendedor/vendedor/{idVendedor}, POST /resenas-vendedor { idPago, idVendedor, clasificacion, comentario }
// y PATCH /resenas-vendedor/{id}. El vendedor se identifica por id (sale de los libros del catálogo).
const useResenasVendedor = (tienda, idConocido = null) => {
  const { user } = useAuth()
  const { pedidos } = useCompra()
  const { libros } = useLibros()
  const toast = useToast()
  const idVendedor = idConocido ?? libros.find((l) => l.v === tienda)?.vId ?? null
  const [resenias, setResenias] = useState([])

  useEffect(() => {
    if (idVendedor == null) return undefined
    let vigente = true
    getResenasVendedorApi(idVendedor).then((r) => { if (vigente) setResenias(r) }).catch(() => {})
    return () => { vigente = false }
  }, [idVendedor])

  const promedio = useMemo(
    () => (resenias.length ? resenias.reduce((a, r) => a + r.st, 0) / resenias.length : 0),
    [resenias],
  )

  // Se toma el vendedor del ítem comprado, no de la muestra local de libros: esa
  // muestra puede estar paginada y no contener una compra anterior.
  const comprados = useMemo(
    () => pedidos
      .filter((p) => estadoPago(p) === 'SIMULADO_APROBADO')
      .flatMap((p) => p.its.filter((i) => i.idVendedor === idVendedor)),
    [pedidos, idVendedor],
  )

  // ¿Es la tienda de la cuenta con sesión? (el vendedor mirando su propia vista pública)
  const esPropio = Boolean(user) && idVendedor != null && user.id === idVendedor
  const puedeResenar = Boolean(user) && user.rol === 'COMPRADOR' && !esPropio && comprados.length > 0

  const miResena = user ? resenias.find((r) => r.idComprador === user.id) || null : null
  const libroComprado = comprados.length ? comprados[0].t : ''

  const publicarApi = async (st, texto) => {
    try {
      // El back liga la reseña a un pago aprobado de una orden que incluya libros de ese vendedor
      const pedido = pedidos.find((p) => estadoPago(p) === 'SIMULADO_APROBADO' && p.its.some((i) => i.idVendedor === idVendedor))
      const pago = pedido && (await pagosDeOrdenApi(pedido.idOrden)).find((p) => p.resultado === 'SIMULADO_APROBADO')
      if (!pago) throw new Error('No encontramos el pago de tu compra a este vendedor.')
      const cuerpo = { idPago: pago.id, idVendedor, clasificacion: st, comentario: texto }
      if (miResena) await modificarResenaVendedorApi(miResena.id, cuerpo)
      else await crearResenaVendedorApi(cuerpo)
      setResenias(await getResenasVendedorApi(idVendedor))
      toast(miResena ? 'Reseña actualizada' : '¡Gracias por calificar al vendedor!')
    } catch (err) {
      toast(err.response ? mensajeError(err) : err.message)
    }
  }

  const publicar = publicarApi

  return { resenias, promedio, miResena, libroComprado, esPropio, puedeResenar, publicar }
}

export default useResenasVendedor
