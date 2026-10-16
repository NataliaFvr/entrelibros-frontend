import { useEffect, useMemo, useState } from 'react'
import { useAuth } from './useAuth'
import { useLibros } from './useLibros'
import { useToast } from './useToast'
import { crearResenaVendedorApi, eliminarResenaVendedorApi, getEstadoResenaVendedorApi, getResenasVendedorApi, modificarResenaVendedorApi } from '../api/resenasApi'
import { mensajeError } from '../utils/errorApi'

// Reseñas de compradores de un vendedor. El backend informa la autorización,
// el pago asociado y la reseña de la sesión actual.
const useResenasVendedor = (tienda, idConocido = null) => {
  const { user } = useAuth()
  const { libros } = useLibros()
  const toast = useToast()
  const idVendedor = idConocido ?? libros.find((l) => l.v === tienda)?.vId ?? null
  const [resenias, setResenias] = useState([])
  const [estado, setEstado] = useState({ puedeResenar: false, motivo: '', idPago: null, miResena: null })

  useEffect(() => {
    if (idVendedor == null) return undefined
    let vigente = true
    getResenasVendedorApi(idVendedor).then((r) => { if (vigente) setResenias(r) }).catch(() => {})
    return () => { vigente = false }
  }, [idVendedor])

  useEffect(() => {
    if (idVendedor == null || !user) {
      setEstado({ puedeResenar: false, motivo: user ? '' : 'Iniciá sesión para dejar una reseña.', idPago: null, miResena: null })
      return undefined
    }
    let vigente = true
    getEstadoResenaVendedorApi(idVendedor).then((r) => { if (vigente) setEstado(r) }).catch(() => {
      if (vigente) setEstado({ puedeResenar: false, motivo: '', idPago: null, miResena: null })
    })
    return () => { vigente = false }
  }, [idVendedor, user])

  const promedio = useMemo(
    () => (resenias.length ? resenias.reduce((a, r) => a + r.st, 0) / resenias.length : 0),
    [resenias],
  )

  const miResena = estado.miResena

  const publicarApi = async (st, texto) => {
    try {
      const cuerpo = { idPago: estado.idPago, idVendedor, clasificacion: st, comentario: texto }
      if (miResena) await modificarResenaVendedorApi(miResena.id, cuerpo)
      else await crearResenaVendedorApi(cuerpo)
      setResenias(await getResenasVendedorApi(idVendedor))
      if (user) setEstado(await getEstadoResenaVendedorApi(idVendedor))
      toast(miResena ? 'Reseña actualizada' : '¡Gracias por calificar al vendedor!')
      return true
    } catch (err) {
      toast(err.response ? mensajeError(err) : err.message)
      return false
    }
  }

  const publicar = publicarApi

  // DELETE /resenas-vendedor/{id}: la borra quien la escribió o un admin (el back lo valida).
  // Sin id borra la propia; el admin pasa el id de cualquier reseña.
  const eliminar = async (id = miResena?.id) => {
    if (!id) return false
    try {
      await eliminarResenaVendedorApi(id)
      setResenias(await getResenasVendedorApi(idVendedor))
      toast('Reseña eliminada')
      return true
    } catch (err) {
      toast(mensajeError(err))
      return false
    }
  }

  return { resenias, promedio, miResena, puedeResenar: estado.puedeResenar, motivo: estado.motivo, publicar, eliminar }
}

export default useResenasVendedor
