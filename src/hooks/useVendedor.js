import { useEffect, useState } from 'react'
import { useLibros } from './useLibros'
import { useToast } from './useToast'
<<<<<<< HEAD
import { enRevision, getVendedor } from '../services/vendedorService'
import { esModeracionError, modificarLibro } from '../services/moderacionService'
=======
import { enRevision, getVendedor } from '../api/vendedorApi'
import { esModeracionError, modificarLibro } from '../api/moderacionApiExtra'
>>>>>>> 726f86e (Union)
import { darDeBajaApi, crearLibroApi, getImagenesApi, reactivarApi, subirImagenApi } from '../api/librosApi'
import { traerPublicaciones } from '../api/publicacionesApi'
import useMisLibros from './useMisLibros'
import { idsDeCategorias } from '../api/categoriasApi'
import { solicitarVendedorApi } from '../api/usuariosApi'
<<<<<<< HEAD
import { dataUrlAFile } from '../utils/adaptadores'
=======
import { dataUrlAFile } from '../api/adaptadores'
>>>>>>> 726f86e (Union)
import { mensajeError } from '../utils/errorApi'
import { aLibroRequest } from '../utils/libroRequest'
import { categoriasDe } from '../utils/libro'

const MENSAJE_REVISION = 'Tus cambios fueron enviados a revisión. El libro no se verá en el catálogo hasta que un administrador lo apruebe.'

const esFotoNueva = (foto) => typeof foto === 'string' && foto.startsWith('data:')

const useVendedor = (user) => {
  const toast = useToast()
  const { recargar } = useLibros()
  const [vendedor, setVendedor] = useState(() => getVendedor(user))

  // Guarda y avisa. Devuelve { ok: true } o { error } (también lo muestra en un toast)
  const cambiar = (nuevo, mensaje) => {
    setVendedor(nuevo)
    recargar()
    if (mensaje) toast(mensaje)
    return { ok: true }
  }
  const cambiarLibros = (fn, mensaje) => cambiar({ ...vendedor, pub: fn(vendedor.pub) }, mensaje)

  // Con el back: la lista del panel sale de GET /libros/mios (estado de moderación y de publicación según el servidor).
  // `estadoLibros` distingue "cargando", "ok" (si no hay libros, estado vacío) y "error" (con toast y "Reintentar").
  const { estado: estadoLibros, reintentar } = useMisLibros(vendedor.estado === 'aprobado', async () => {
<<<<<<< HEAD
    const pub = await traerPublicaciones(vendedor.pub, libros)
=======
    const pub = await traerPublicaciones()
>>>>>>> 726f86e (Union)
    if (JSON.stringify(pub) !== JSON.stringify(vendedor.pub)) cambiar({ ...vendedor, pub })
  })

  useEffect(() => { setVendedor(getVendedor(user)) }, [user])

  const solicitar = async (datos) => {
    try {
      await solicitarVendedorApi(datos)
    } catch (err) {
      toast(mensajeError(err, 'libro'))
      return
    }
    cambiar({ ...vendedor, ...datos, estado: 'pendiente' }, 'Solicitud enviada')
  }

  // Sube a /imagenes-libro las fotos nuevas (las que todavía son base64) y devuelve las URLs finales del libro
  const subirFotos = async (idLibro, fotos = []) => {
    for (let i = 0; i < fotos.length; i++) {
      if (esFotoNueva(fotos[i])) await subirImagenApi(idLibro, await dataUrlAFile(fotos[i], `foto-${i + 1}`), i)
    }
    return getImagenesApi(idLibro)
  }

  // Publica un libro nuevo en el back: POST /libros (queda EN_REVISION) y después las fotos
  const crearEnApi = async (datos) => {
    let creado
    try {
      creado = await crearLibroApi(aLibroRequest(datos, await idsDeCategorias(categoriasDe(datos))))
    } catch (err) {
      const mensaje = mensajeError(err, 'libro')
      toast(mensaje)
      return { error: mensaje }
    }
    let imgs = []
    let fallaronFotos = false
    try { imgs = await subirFotos(creado.id, datos.imgs) } catch { fallaronFotos = true }
    const resultado = cambiarLibros(
      (pub) => [{ ...datos, id: creado.id, imgs, estado: 'activo', mod: creado.estadoModeracion || 'EN_REVISION' }, ...pub],
      'Libro enviado a revisión del administrador',
    )
    if (fallaronFotos) toast('El libro se creó, pero no pudimos subir las fotos. Editalo para volver a intentarlo.')
    return resultado
  }

  // Sin `idEditado` publica uno nuevo; con `idEditado` lo modifica. Devuelve { ok } o { error }.
  // Editar un libro ya aceptado lo pasa a revisión y lo saca del catálogo hasta que se apruebe (como el back);
  // la versión aprobada se conserva y los cambios quedan en `revision`.
  const guardarLibro = async (datos, idEditado) => {
    if (!idEditado) {
      return crearEnApi(datos)
    }
    const actual = vendedor.pub.find((p) => p.id === idEditado)
    if (!actual) return { error: 'No encontramos ese libro. Puede que ya no exista.' }
    if (enRevision(actual)) return { error: 'Este libro ya tiene una revisión pendiente. Esperá a que un administrador la resuelva.' }

    // PATCH /libros/{id}. El estado que manda el back es la verdad: solo si vuelve EN_REVISION se muestra como pendiente.
    let enviadoARevision = true
    let imgs = datos.imgs
    try {
      const ids = await idsDeCategorias(categoriasDe(datos))
      const libro = await modificarLibro(idEditado, aLibroRequest(datos, ids.length ? ids : undefined))
      enviadoARevision = libro.estadoModeracion === 'EN_REVISION'
      imgs = await subirFotos(idEditado, datos.imgs)
    } catch (err) {
      const mensaje = esModeracionError(err) ? err.message : mensajeError(err, 'libro')
      toast(mensaje)
      return { error: mensaje }
    }
    const nuevosDatos = { ...datos, imgs }

    const aceptado = (actual.mod || 'ACEPTADO') === 'ACEPTADO'
    return cambiarLibros(
      (pub) => pub.map((p) => {
        if (p.id !== idEditado) return p
        if (!enviadoARevision) return { ...p, ...nuevosDatos, modC: '' } // el back ya aplicó los cambios: no hay nada que revisar
        return aceptado ? { ...p, revision: nuevosDatos, modC: '' } : { ...p, ...nuevosDatos, mod: 'EN_REVISION', modC: '' }
      }),
      enviadoARevision ? MENSAJE_REVISION : 'Cambios guardados',
    )
  }

  const alternarBaja = async (id) => {
    const p = vendedor.pub.find((x) => x.id === id)
    try {
      await (p.estado === 'activo' ? darDeBajaApi(id) : reactivarApi(id))
    } catch (err) {
      toast(mensajeError(err, 'libro'))
      return
    }
    cambiarLibros((pub) => pub.map((x) => (x.id === id ? { ...x, estado: x.estado === 'activo' ? 'baja' : 'activo' } : x)),
      p.estado === 'activo' ? 'Libro dado de baja' : 'Libro reactivado')
  }

  return { vendedor, estadoLibros, reintentar, solicitar, guardarLibro, alternarBaja }
}

export default useVendedor
