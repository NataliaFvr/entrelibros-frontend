import { useState } from 'react'
import { useLibros } from './useLibros'
import { useToast } from './useToast'
import { enRevision, getVendedor, guardarVendedor, nuevoIdPublicacion } from '../services/vendedorService'
import { esModeracionError, modificarLibro } from '../services/moderacionService'
import { aLibroRequest } from '../utils/libroRequest'

// Mientras el resto de la app trabaja con datos de ejemplo (ids y sesión locales), las ediciones solo pueden ir
// al back si éste está activo: VITE_API_LIBROS=true en .env. Sin eso se mantiene el comportamiento de demostración.
const USAR_API = import.meta.env.VITE_API_LIBROS === 'true'
const MENSAJE_REVISION = 'Tus cambios han sido enviados a revisión por un administrador'

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
  const guardarLibro = async (datos, idEditado) => {
    if (!idEditado) {
      return cambiarLibros((pub) => [{ id: nuevoIdPublicacion(), ...datos, estado: 'activo', mod: 'EN_REVISION' }, ...pub],
        'Libro enviado a revisión del administrador')
    }
    const actual = vendedor.pub.find((p) => p.id === idEditado)
    if (!actual) return { error: 'No encontramos ese libro. Puede que ya no exista.' }
    if (enRevision(actual)) return { error: 'Este libro ya tiene una revisión pendiente. Esperá a que un administrador la resuelva.' }

    // PATCH /libros/{id}. El estado que manda el back es la verdad: solo si vuelve EN_REVISION se muestra como pendiente.
    let enviadoARevision = true
    if (USAR_API) {
      try {
        const libro = await modificarLibro(idEditado, aLibroRequest(datos))
        enviadoARevision = libro.estadoModeracion === 'EN_REVISION'
      } catch (err) {
        const mensaje = esModeracionError(err) ? err.message : 'No pudimos guardar los cambios. Intentá de nuevo.'
        toast(mensaje)
        return { error: mensaje } // el formulario lo muestra en pantalla y no pierde lo escrito
      }
    }

    const aceptado = (actual.mod || 'ACEPTADO') === 'ACEPTADO'
    return cambiarLibros(
      (pub) => pub.map((p) => {
        if (p.id !== idEditado) return p
        if (!enviadoARevision) return { ...p, ...datos, modC: '' } // el back ya aplicó los cambios: no hay nada que revisar
        return aceptado ? { ...p, revision: datos, modC: '' } : { ...p, ...datos, mod: 'EN_REVISION', modC: '' }
      }),
      enviadoARevision ? MENSAJE_REVISION : 'Cambios guardados',
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
