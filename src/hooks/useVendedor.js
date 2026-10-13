import { useEffect, useState } from 'react'
import { useLibros } from './useLibros'
import { useToast } from './useToast'
import { enRevision, getVendedor } from '../api/vendedorApi'
import { esModeracionError, modificarLibro } from '../api/moderacionApiExtra'
import { darDeBajaApi, crearLibroApi, getImagenesApi, reactivarApi } from '../api/librosApi'
import { FotosError, sincronizarFotosApi } from '../api/fotosLibro'
import { traerPublicaciones } from '../api/publicacionesApi'
import useMisLibros from './useMisLibros'
import { idsDeCategorias } from '../api/categoriasApi'
import { solicitarVendedorApi } from '../api/usuariosApi'
import { mensajeError } from '../utils/errorApi'
import { aLibroRequest } from '../utils/libroRequest'
import { categoriasDe } from '../utils/libro'

const MENSAJE_REVISION = 'Tus cambios fueron enviados a revisión. El libro no se verá en el catálogo hasta que un administrador lo apruebe.'

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
    const pub = await traerPublicaciones()
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

  // Deja las fotos del servidor igual que el formulario (quitadas, nuevas y orden). Devuelve { imgs, aviso }:
  // si algo falla, `aviso` explica qué pasó e `imgs` son las fotos que realmente quedaron guardadas.
  const subirFotos = async (idLibro, fotos = [], respaldo = []) => {
    try {
      return { imgs: await sincronizarFotosApi(idLibro, fotos) }
    } catch (err) {
      const aviso = err instanceof FotosError ? err.message : mensajeError(err, 'libro')
      return { imgs: await getImagenesApi(idLibro).catch(() => respaldo), aviso }
    }
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
    const { imgs, aviso } = await subirFotos(creado.id, datos.imgs)
    const resultado = cambiarLibros(
      (pub) => [{ ...datos, id: creado.id, imgs, estado: 'activo', mod: creado.estadoModeracion || 'EN_REVISION' }, ...pub],
      'Libro enviado a revisión del administrador',
    )
    if (aviso) toast(`El libro se creó, pero las fotos no se guardaron bien. ${aviso} Editalo para volver a intentarlo.`)
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
    let avisoFotos = ''
    try {
      const ids = await idsDeCategorias(categoriasDe(datos))
      const libro = await modificarLibro(idEditado, aLibroRequest(datos, ids.length ? ids : undefined))
      enviadoARevision = libro.estadoModeracion === 'EN_REVISION'
      // El PATCH ya se aplicó: si fallan las fotos no es un error del guardado, se avisa aparte y se muestran las que quedaron
      const fotos = await subirFotos(idEditado, datos.imgs, actual.imgs)
      imgs = fotos.imgs
      avisoFotos = fotos.aviso
    } catch (err) {
      const mensaje = esModeracionError(err) ? err.message : mensajeError(err, 'libro')
      toast(mensaje)
      return { error: mensaje }
    }
    const nuevosDatos = { ...datos, imgs }

    const aceptado = (actual.mod || 'ACEPTADO') === 'ACEPTADO'
    const resultado = cambiarLibros(
      (pub) => pub.map((p) => {
        if (p.id !== idEditado) return p
        if (!enviadoARevision) return { ...p, ...nuevosDatos, modC: '' } // el back ya aplicó los cambios: no hay nada que revisar
        return aceptado ? { ...p, revision: nuevosDatos, modC: '' } : { ...p, ...nuevosDatos, mod: 'EN_REVISION', modC: '' }
      }),
      enviadoARevision ? MENSAJE_REVISION : 'Cambios guardados',
    )
    if (avisoFotos) toast(`Guardamos los datos del libro, pero las fotos no se actualizaron bien. ${avisoFotos}`)
    return resultado
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
