import { useEffect, useMemo, useState } from 'react'
import { useAuth } from './useAuth'
import { useCompra } from './useCompra'
import { useLibros } from './useLibros'
import { useToast } from './useToast'
import { agregarResenaVendedor, getResenasVendedor, guardarMiResenaId, miResenaId } from '../services/resenasVendedorService'
import { tiendaDe } from '../services/vendedorService'
import { crearResenaVendedorApi, getResenasVendedorApi, modificarResenaVendedorApi } from '../api/resenasApi'
import { pagosDeOrdenApi } from '../api/comprasApi'
import { mensajeError } from '../utils/errorApi'
import { USAR_API } from '../utils/modoApi'
import { estadoPago } from '../utils/pedidos'

// Reseñas de compradores de un vendedor + promedio. Solo puede reseñarlo un usuario con rol COMPRADOR que ya le compró
// (pedido pagado) y que no sea el dueño de la tienda. Cada comprador tiene una única reseña por vendedor: si vuelve a publicar, se reemplaza.
// Con el back: GET /resenas-vendedor/vendedor/{idVendedor}, POST /resenas-vendedor { idPago, idVendedor, clasificacion, comentario }
// y PATCH /resenas-vendedor/{id}. El vendedor se identifica por id (sale de los libros del catálogo).
const useResenasVendedor = (tienda) => {
  const { user } = useAuth()
  const { pedidos } = useCompra()
  const { libros } = useLibros()
  const toast = useToast()
  const idVendedor = USAR_API ? (libros.find((l) => l.v === tienda)?.vId ?? null) : null
  const [resenias, setResenias] = useState(() => (USAR_API ? [] : getResenasVendedor(tienda)))

  useEffect(() => {
    if (!USAR_API || idVendedor == null) return undefined
    let vigente = true
    getResenasVendedorApi(idVendedor).then((r) => { if (vigente) setResenias(r) }).catch(() => {})
    return () => { vigente = false }
  }, [idVendedor])

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

  // ¿Es la tienda de la cuenta con sesión? (el vendedor mirando su propia vista pública)
  const miTienda = useMemo(() => tiendaDe(user), [user])
  const esPropio = USAR_API ? Boolean(user) && idVendedor != null && user.id === idVendedor : Boolean(miTienda) && miTienda === tienda
  const puedeResenar = Boolean(user) && user.rol === 'COMPRADOR' && !esPropio && comprados.length > 0

  const idMia = USAR_API && user && idVendedor != null ? miResenaId(user, idVendedor) : null
  const miResena = user ? (USAR_API ? resenias.find((r) => r.id === idMia) : resenias.find((r) => r.u === user.nombreUsuario)) || null : null
  const libroComprado = comprados.length ? comprados[0].t : ''

  const publicarApi = async (st, texto) => {
    try {
      // El back liga la reseña a un pago aprobado de una orden que incluya libros de ese vendedor
      const pedido = pedidos.find((p) => estadoPago(p) === 'SIMULADO_APROBADO' && p.its.some((i) => i.idVendedor === idVendedor))
      const pago = pedido && (await pagosDeOrdenApi(pedido.idOrden)).find((p) => p.resultado === 'SIMULADO_APROBADO')
      if (!pago) throw new Error('No encontramos el pago de tu compra a este vendedor.')
      const cuerpo = { idPago: pago.id, idVendedor, clasificacion: st, comentario: texto }
      const guardada = miResena ? await modificarResenaVendedorApi(miResena.id, cuerpo) : await crearResenaVendedorApi(cuerpo)
      guardarMiResenaId(user, idVendedor, guardada.id)
      setResenias(await getResenasVendedorApi(idVendedor))
      toast(miResena ? 'Reseña actualizada' : '¡Gracias por calificar al vendedor!')
    } catch (err) {
      toast(err.response ? mensajeError(err) : err.message)
    }
  }

  const publicar = (st, texto) => {
    if (USAR_API) return publicarApi(st, texto)
    agregarResenaVendedor(tienda, {
      u: user.nombreUsuario, nc: `${user.nombre} ${user.apellido[0]}.`, st, t: texto, libro: libroComprado,
    })
    setResenias(getResenasVendedor(tienda))
    toast(miResena ? 'Reseña actualizada' : '¡Gracias por calificar al vendedor!')
    return undefined
  }

  return { resenias, promedio, miResena, libroComprado, esPropio, puedeResenar, publicar }
}

export default useResenasVendedor
