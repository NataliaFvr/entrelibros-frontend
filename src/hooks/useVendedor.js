import { useState } from 'react'
import { useLibros } from './useLibros'
import { useToast } from './useToast'
import { enRevision, getVendedor, guardarVendedor, nuevoIdPublicacion } from '../services/vendedorService'

// Estado y acciones del vendedor de la cuenta `user`. Cada cambio se guarda y refresca el catálogo.
const useVendedor = (user) => {
  const toast = useToast()
  const { recargar } = useLibros()
  const [vendedor, setVendedor] = useState(() => getVendedor(user))

  // Guarda y avisa. Devuelve { ok: true } o { error } (también lo muestra en un toast)
  const cambiar = (nuevo, mensaje) => {
    // Las fotos viajan en base64 dentro de localStorage (~5 MB): si no entran, avisamos en vez de perderlas en silencio
    if (!guardarVendedor(user, nuevo)) {
      const error = 'No pudimos guardar: sin espacio en el navegador. Probá con menos fotos.'
      toast(error)
      return { error }
    }
    setVendedor(nuevo)
    recargar()
    if (mensaje) toast(mensaje)
    return { ok: true }
  }
  const cambiarLibros = (fn, mensaje) => cambiar({ ...vendedor, pub: fn(vendedor.pub) }, mensaje)

  const solicitar = (datos) => cambiar({ ...vendedor, ...datos, estado: 'pendiente' }, 'Solicitud enviada')
  const aprobarSolicitud = () => cambiar({ ...vendedor, estado: 'aprobado', pub: [] }, '¡Solicitud aprobada!')

  // Sin `idEditado` publica uno nuevo; con `idEditado` lo modifica. Devuelve { ok } o { error }.
  // Un libro ya aceptado conserva su versión aprobada (sigue en el catálogo) y los cambios quedan en `revision`.
  const guardarLibro = (datos, idEditado) => {
    if (!idEditado) {
      return cambiarLibros((pub) => [{ id: nuevoIdPublicacion(), ...datos, estado: 'activo', mod: 'EN_REVISION' }, ...pub],
        'Libro enviado a revisión del administrador')
    }
    const actual = vendedor.pub.find((p) => p.id === idEditado)
    if (!actual) return { error: 'No encontramos ese libro. Puede que ya no exista.' }
    if (enRevision(actual)) return { error: 'Este libro ya tiene una revisión pendiente. Esperá a que un administrador la resuelva.' }

    const aceptado = (actual.mod || 'ACEPTADO') === 'ACEPTADO'
    return cambiarLibros(
      (pub) => pub.map((p) => {
        if (p.id !== idEditado) return p
        return aceptado ? { ...p, revision: datos, modC: '' } : { ...p, ...datos, mod: 'EN_REVISION', modC: '' }
      }),
      'Tus cambios han sido enviados a revisión por un administrador',
    )
  }

  const alternarBaja = (id) => {
    const p = vendedor.pub.find((x) => x.id === id)
    cambiarLibros((pub) => pub.map((x) => (x.id === id ? { ...x, estado: x.estado === 'activo' ? 'baja' : 'activo' } : x)),
      p.estado === 'activo' ? 'Libro dado de baja' : 'Libro reactivado')
  }

  // Simulan la decisión del administrador (demo). Back: PATCH /libros/{id}/moderacion { estadoModeracion, comentario }
  const aprobarLibro = (id) => cambiarLibros((pub) => pub.map((p) => {
    if (p.id !== id) return p
    const { revision, ...resto } = p
    return { ...resto, ...(revision || {}), mod: 'ACEPTADO', modC: '' }
  }), 'Libro aprobado (simulado)')

  const rechazarLibro = (id) => cambiarLibros((pub) => pub.map((p) => {
    if (p.id !== id) return p
    const { revision, ...resto } = p
    const motivo = 'No cumple las pautas de publicación (simulado).'
    return revision ? { ...resto, modC: motivo } : { ...resto, mod: 'RECHAZADO', modC: motivo }
  }), 'Libro rechazado (simulado)')

  return { vendedor, solicitar, aprobarSolicitud, guardarLibro, alternarBaja, aprobarLibro, rechazarLibro }
}

export default useVendedor
