import { useEffect, useState } from 'react'
import { aLibroFront, publicacionAFront } from '../api/adaptadores'; // CAMBIO: se agrega publicacionAFront
import { idsDeCategorias } from '../api/categoriasApi'
import { FotosError, sincronizarFotosApi } from '../api/fotosLibro'
import { crearLibroApi, darDeBajaApi, getImagenesApi, reactivarApi } from '../api/librosApi'
import { esModeracionError, modificarLibro } from '../api/moderacionApiExtra'
import { traerPublicaciones } from '../api/publicacionesApi'
import { solicitarVendedorApi } from '../api/usuariosApi'
import { enRevision, getVendedor } from '../api/vendedorApi'
import { mensajeError } from '../utils/errorApi'
import { categoriasDe } from '../utils/libro'
import { aLibroRequest } from '../utils/libroRequest'
import { useLibros } from './useLibros'
import useMisLibros from './useMisLibros'
import { useToast } from './useToast'

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
      const imgs = await sincronizarFotosApi(idLibro, fotos)
      return { imgs, cambiaron: imgs !== fotos } // devuelve la misma lista si no hubo nada que subir ni borrar
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
      // La fila nueva sale de lo que devolvió el back (precio final incluido), no del formulario
      (pub) => [{ ...datos, ...aLibroFront(creado), imgs, estado: 'activo', mod: creado.estadoModeracion || 'EN_REVISION' }, ...pub],
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
    // CAMBIO: un libro dado de baja (ej. por quedarse sin categoría) se puede editar aunque esté en revisión
    if (enRevision(actual) && actual.estado !== 'baja') return { error: 'Este libro ya tiene una revisión pendiente. Esperá a que un administrador la resuelva.' }

    // PATCH /libros/{id}. El estado que manda el back es la verdad: solo si vuelve EN_REVISION se muestra como pendiente.
    let enviadoARevision = true
    let estadoPub = actual.estado // CAMBIO
    let imgs = datos.imgs
    let avisoFotos = ''
    try {
      const ids = await idsDeCategorias(categoriasDe(datos))
      const pedido = aLibroRequest(datos, ids.length ? ids : undefined)
      // Un usado vendido tiene stock 0: si no se tocó el stock, no se manda (así se puede editar sin reponerlo)
      if (datos.usado && actual.usado && Number(datos.stock) === Number(actual.stock)) delete pedido.stock
      const libro = await modificarLibro(idEditado, pedido)
      enviadoARevision = libro.estadoModeracion === 'EN_REVISION'
      // CAMBIO: el back lo vuelve a publicar si se había dado de baja por quedarse sin categoría
      if (libro.estadoPublicacion) estadoPub = publicacionAFront(libro.estadoPublicacion)
      // El PATCH ya se aplicó: si fallan las fotos no es un error del guardado, se avisa aparte y se muestran las que quedaron
      const fotos = await subirFotos(idEditado, datos.imgs, actual.imgs)
      // Cambiar las fotos también manda el libro a revisión (lo decide el back al subirlas)
      if (fotos.cambiaron) enviadoARevision = true
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
        // CAMBIO: los tres retornos llevan `estado: estadoPub`
        if (!enviadoARevision) return { ...p, ...nuevosDatos, estado: estadoPub, modC: '' } // el back ya aplicó los cambios: no hay nada que revisar
        return aceptado
          ? { ...p, revision: nuevosDatos, estado: estadoPub, modC: '' }
          : { ...p, ...nuevosDatos, mod: 'EN_REVISION', estado: estadoPub, modC: '' }
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