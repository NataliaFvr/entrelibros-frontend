import { useEffect, useState } from 'react'
import { useLibros } from './useLibros'
import useMisLibros from './useMisLibros'
import { useToast } from './useToast'
import { enRevision, getVendedor, guardarVendedor, nuevoIdPublicacion } from '../services/vendedorService'
import { esModeracionError, modificarLibro } from '../services/moderacionService'
import { darDeBajaApi, crearLibroApi, getImagenesApi, getLibroApi, reactivarApi, subirImagenApi } from '../api/librosApi'
import { idsDeCategorias } from '../api/categoriasApi'
import { actualizarUsuarioApi, solicitarVendedorApi } from '../api/usuariosApi'
import { dataUrlAFile, publicacionAFront } from '../utils/adaptadores'
import { mensajeError } from '../utils/errorApi'
import { aLibroRequest } from '../utils/libroRequest'
import { USAR_API } from '../utils/modoApi'

const MENSAJE_REVISION = 'Tus cambios fueron enviados a revisión. El libro no se verá en el catálogo hasta que un administrador lo apruebe.'

const esFotoNueva = (foto) => typeof foto === 'string' && foto.startsWith('data:')

// Estado y acciones del vendedor de la cuenta `user`. Cada cambio se guarda y refresca el catálogo.
// Con el back (VITE_API=true): las publicaciones se crean con POST /libros (+ fotos por /imagenes-libro), se dan de baja con
// PATCH /libros/{id}/baja|reactivar, y la solicitud de vendedor va por POST /usuarios/solicitud-vendedor.
// El back no tiene "mis libros" con los pendientes: la lista del panel se guarda acá con los ids reales y su estado
// (moderación, baja) se vuelve a leer del back (GET /libros/{id}) al abrir el panel.
const useVendedor = (user) => {
  const toast = useToast()
  const { recargar } = useLibros()
  const [vendedor, setVendedor] = useState(() => getVendedor(user))

  // Con el back: libros del vendedor según el servidor. `estadoLibros` distingue "sin libros" ('ok' + lista vacía) de un fallo ('error')
  const { estado: estadoLibros, libros: librosDelBack, reintentar: recargarMisLibros } = useMisLibros(user.id, USAR_API && vendedor.estado === 'aprobado')

  // Libros que el back ya tiene como publicados pero este navegador no conoce (otro dispositivo, datos locales borrados): se suman al panel
  useEffect(() => {
    if (!USAR_API || !librosDelBack.length) return
    const guardado = getVendedor(user)
    const faltan = librosDelBack.filter((l) => !guardado.pub.some((p) => String(p.id) === String(l.id)))
    if (!faltan.length) return
    const nuevos = faltan.map((l) => ({
      id: l.id, t: l.t, a: l.a, ed: l.ed, idioma: l.idioma, anio: l.anio, usado: l.usado, base: l.base, d: l.d, stock: l.stock,
      cat: l.cat, imgs: [], descripcion: l.descripcion, estado: publicacionAFront(l.estadoPublicacion), mod: l.estadoModeracion || 'ACEPTADO',
    }))
    const completo = { ...guardado, pub: [...nuevos, ...guardado.pub] }
    if (guardarVendedor(user, completo)) setVendedor(completo)
    // `user` no cambia mientras el panel está abierto (el panel se remonta por cuenta)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [librosDelBack])

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

  // Con el back: estado de moderación y de publicación de cada libro, según el servidor
  useEffect(() => {
    if (!USAR_API || vendedor.estado !== 'aprobado' || !vendedor.pub.length) return undefined
    let vigente = true
    Promise.all(vendedor.pub.map((p) => getLibroApi(p.id).catch(() => null))).then((libros) => {
      if (!vigente) return
      const porId = new Map(libros.filter(Boolean).map((l) => [l.id, l]))
      if (!porId.size) return
      const pub = vendedor.pub.map((p) => {
        const l = porId.get(p.id)
        if (!l) return p
        const { revision, ...resto } = p // eslint-disable-line no-unused-vars
        return {
          ...resto, t: l.t, a: l.a, ed: l.ed, idioma: l.idioma, anio: l.anio, usado: l.usado, base: l.base, d: l.d, stock: l.stock,
          descripcion: l.descripcion, mod: l.estadoModeracion || p.mod, estado: publicacionAFront(l.estadoPublicacion),
        }
      })
      if (JSON.stringify(pub) !== JSON.stringify(vendedor.pub)) cambiar({ ...vendedor, pub })
    })
    return () => { vigente = false }
    // Solo al abrir el panel
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const solicitar = async (datos) => {
    if (USAR_API) {
      try {
        await solicitarVendedorApi(datos.tienda)
        if (datos.prov && datos.prov !== user.provincia) await actualizarUsuarioApi(user.id, { provincia: datos.prov })
      } catch (err) {
        toast(mensajeError(err, 'libro'))
        return
      }
    }
    cambiar({ ...vendedor, ...datos, estado: 'pendiente' }, 'Solicitud enviada')
  }
  const aprobarSolicitud = () => cambiar({ ...vendedor, estado: 'aprobado', pub: [] }, '¡Solicitud aprobada!')

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
      creado = await crearLibroApi(aLibroRequest(datos, await idsDeCategorias([datos.cat])))
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
      if (USAR_API) return crearEnApi(datos)
      return cambiarLibros((pub) => [{ id: nuevoIdPublicacion(), ...datos, estado: 'activo', mod: 'EN_REVISION' }, ...pub],
        'Libro enviado a revisión del administrador')
    }
    const actual = vendedor.pub.find((p) => p.id === idEditado)
    if (!actual) return { error: 'No encontramos ese libro. Puede que ya no exista.' }
    if (enRevision(actual)) return { error: 'Este libro ya tiene una revisión pendiente. Esperá a que un administrador la resuelva.' }

    // PATCH /libros/{id}. El estado que manda el back es la verdad: solo si vuelve EN_REVISION se muestra como pendiente.
    let enviadoARevision = true
    let imgs = datos.imgs
    if (USAR_API) {
      try {
        const ids = await idsDeCategorias([datos.cat])
        const libro = await modificarLibro(idEditado, aLibroRequest(datos, ids.length ? ids : undefined))
        enviadoARevision = libro.estadoModeracion === 'EN_REVISION'
        imgs = await subirFotos(idEditado, datos.imgs)
      } catch (err) {
        const mensaje = esModeracionError(err) ? err.message : mensajeError(err, 'libro')
        toast(mensaje)
        return { error: mensaje } // el formulario lo muestra en pantalla y no pierde lo escrito
      }
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
    if (USAR_API) {
      try {
        await (p.estado === 'activo' ? darDeBajaApi(id) : reactivarApi(id))
      } catch (err) {
        toast(mensajeError(err, 'libro'))
        return
      }
    }
    cambiarLibros((pub) => pub.map((x) => (x.id === id ? { ...x, estado: x.estado === 'activo' ? 'baja' : 'activo' } : x)),
      p.estado === 'activo' ? 'Libro dado de baja' : 'Libro reactivado')
  }

  // Simulan la decisión del administrador (solo modo demo). Con el back la decide el panel de moderación: PATCH /libros/{id}/moderacion
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

  return { vendedor, estadoLibros, recargarMisLibros, solicitar, aprobarSolicitud, guardarLibro, alternarBaja, aprobarLibro, rechazarLibro }
}

export default useVendedor
