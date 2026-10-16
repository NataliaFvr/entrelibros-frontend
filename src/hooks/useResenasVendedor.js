import { useEffect, useMemo, useState } from 'react'
import { useAuth } from './useAuth'
import { useLibros } from './useLibros'
import { useToast } from './useToast'
import {
  crearResenaVendedorApi,
  eliminarResenaVendedorApi,
  getEstadoResenaVendedorApi,
  getResenasVendedorApi,
  modificarResenaVendedorApi,
} from '../api/resenasApi'
import { mensajeError } from '../utils/errorApi'

// El backend determina el permiso, el pago asociado y la reseña del usuario actual.
const useResenasVendedor = (tienda, idConocido = null) => {
  const { user } = useAuth()
  const { libros } = useLibros()
  const toast = useToast()
  const idVendedor = idConocido ?? libros.find((libro) => libro.v === tienda)?.vId ?? null
  const [resenias, setResenias] = useState([])
  const [estado, setEstado] = useState({
    puedeResenar: false,
    motivo: '',
    idPago: null,
    miResena: null,
    usuarioId: null,
    vendedorId: null,
  })

  useEffect(() => {
    if (idVendedor == null) return undefined
    let vigente = true
    getResenasVendedorApi(idVendedor)
      .then((lista) => { if (vigente) setResenias(lista) })
      .catch(() => {})
    return () => { vigente = false }
  }, [idVendedor])

  useEffect(() => {
    if (idVendedor == null || !user) return undefined

    let vigente = true
    getEstadoResenaVendedorApi(idVendedor)
      .then((nuevoEstado) => {
        if (vigente) setEstado({ ...nuevoEstado, usuarioId: user.id, vendedorId: idVendedor })
      })
      .catch(() => {
        if (vigente) {
          setEstado({
            puedeResenar: false,
            motivo: '',
            idPago: null,
            miResena: null,
            usuarioId: user.id,
            vendedorId: idVendedor,
          })
        }
      })
    return () => { vigente = false }
  }, [idVendedor, user])

  const promedio = useMemo(
    () => (resenias.length ? resenias.reduce((suma, resenia) => suma + resenia.st, 0) / resenias.length : 0),
    [resenias],
  )
  const estadoActual = estado.usuarioId === user?.id && estado.vendedorId === idVendedor
    ? estado
    : {
        puedeResenar: false,
        motivo: user ? '' : 'Iniciá sesión para dejar una reseña.',
        idPago: null,
        miResena: null,
      }
  const miResena = estadoActual.miResena
  const esPropio = Boolean(user) && idVendedor != null && user.id === idVendedor
  const esAdmin = user?.rol === 'ADMIN'

  const publicar = async (clasificacion, comentario) => {
    try {
      const cuerpo = {
        idPago: estadoActual.idPago,
        idVendedor,
        clasificacion,
        comentario,
      }
      if (miResena) await modificarResenaVendedorApi(miResena.id, cuerpo)
      else await crearResenaVendedorApi(cuerpo)

      setResenias(await getResenasVendedorApi(idVendedor))
      if (user) {
        setEstado({
          ...await getEstadoResenaVendedorApi(idVendedor),
          usuarioId: user.id,
          vendedorId: idVendedor,
        })
      }
      toast(miResena ? 'Reseña actualizada' : '¡Gracias por calificar al vendedor!')
      return true
    } catch (err) {
      toast(err.response ? mensajeError(err) : err.message)
      return false
    }
  }

  // La API valida si el usuario puede borrar esta reseña.
  const eliminar = async (idResena = miResena?.id) => {
    if (idResena == null) return false
    try {
      await eliminarResenaVendedorApi(idResena)
      setResenias(await getResenasVendedorApi(idVendedor))
      if (user) {
        setEstado({
          ...await getEstadoResenaVendedorApi(idVendedor),
          usuarioId: user.id,
          vendedorId: idVendedor,
        })
      }
      toast('Reseña eliminada')
      return true
    } catch (err) {
      toast(mensajeError(err))
      return false
    }
  }

  return {
    resenias,
    promedio,
    miResena,
    esPropio,
    esAdmin,
    puedeResenar: estadoActual.puedeResenar,
    motivo: estadoActual.motivo,
    publicar,
    eliminar,
  }
}

export default useResenasVendedor
