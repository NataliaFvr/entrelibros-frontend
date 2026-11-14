import { useEffect, useMemo } from 'react'
import { enRevision, getVendedor } from '../api/vendedorApi'
import { mostrarToast } from '../redux/toastSlice'
import { cambiarEstadoLibro, editarLibro, fetchFotosLibro, fetchMisLibros, publicarLibro, solicitarVendedor } from '../redux/vendedorSlice'

const MENSAJE_REVISION = 'Tus cambios fueron enviados a revisión. El libro no se verá en el catálogo hasta que un administrador lo apruebe.'

// Panel del vendedor: sus datos salen de la sesión y sus libros de Redux (redux/vendedorSlice.js).
// Acá solo se despachan las acciones y se arman los avisos.
// `idEditando` = el libro que está abierto en "Editar": para el formulario hacen falta todas sus fotos.
const useVendedor = (user, idEditando = null, { dispatch, idUsuario, items, loading, error }) => {
  const toast = (msg, accion) => dispatch(mostrarToast({ msg, accion }))
  const pub = useMemo(() => (idUsuario === user.id ? items : []), [idUsuario, items, user.id]) // solo los de esta cuenta
  const vendedor = useMemo(() => ({ ...getVendedor(user), pub }), [user, pub])
  const aprobado = vendedor.estado === 'aprobado'
  const cargados = idUsuario === user.id

  // GET /libros/mios la primera vez que se entra al panel con esta cuenta: después la lista vive en Redux
  useEffect(() => {
    if (aprobado && !cargados) dispatch(fetchMisLibros(user.id))
  }, [dispatch, aprobado, cargados, user.id])

  const editando = idEditando == null ? null : pub.find((p) => String(p.id) === String(idEditando))
  const faltanFotos = Boolean(editando && !editando.fotosCompletas)
  useEffect(() => {
    if (faltanFotos) dispatch(fetchFotosLibro(editando.id))
  }, [dispatch, faltanFotos, editando])

  // Si la carga falla se avisa una vez; en el panel queda "Reintentar"
  useEffect(() => {
  if (error) dispatch(mostrarToast({ msg: error }))
}, [dispatch, error])
  // 'cargando' | 'ok' (si no hay libros, estado vacío) | 'error'
  const estadoLibros = !aprobado ? 'ok' : loading || (!cargados && !error) ? 'cargando' : error ? 'error' : 'ok'

  const solicitar = async (datos) => {
    const resultado = await dispatch(solicitarVendedor(datos))
    toast(resultado.error ? resultado.error.message : 'Solicitud enviada')
  }

  // Sin `idEditado` publica uno nuevo; con `idEditado` lo modifica. Devuelve { ok } o { error }.
  const guardarLibro = async (datos, idEditado) => {
    if (!idEditado) {
      const resultado = await dispatch(publicarLibro(datos))
      if (resultado.error) { toast(resultado.error.message); return { error: resultado.error.message } }
      toast('Libro enviado a revisión del administrador')
      if (resultado.payload.aviso) toast(`El libro se creó, pero las fotos no se guardaron bien. ${resultado.payload.aviso} Editalo para volver a intentarlo.`)
      return { ok: true }
    }
    const actual = pub.find((p) => p.id === idEditado)
    if (!actual) return { error: 'No encontramos ese libro. Puede que ya no exista.' }
    // Un libro dado de baja (ej. por quedarse sin categoría) se puede editar aunque esté en revisión
    if (enRevision(actual) && actual.estado !== 'baja') return { error: 'Este libro ya tiene una revisión pendiente. Esperá a que un administrador la resuelva.' }
    const resultado = await dispatch(editarLibro({ datos, actual }))
    if (resultado.error) { toast(resultado.error.message); return { error: resultado.error.message } }
    const { enviadoARevision, aviso } = resultado.payload
    toast(enviadoARevision ? MENSAJE_REVISION : 'Cambios guardados')
    if (aviso) toast(`Guardamos los datos del libro, pero las fotos no se actualizaron bien. ${aviso}`)
    return { ok: true }
  }

  const alternarBaja = async (id) => {
    const activo = pub.find((x) => x.id === id).estado !== 'activo' // si estaba activo, se da de baja
    const resultado = await dispatch(cambiarEstadoLibro({ id, activo }))
    toast(resultado.error ? resultado.error.message : activo ? 'Libro reactivado' : 'Libro dado de baja')
  }

  return { vendedor, estadoLibros, faltanFotos, reintentar: () => dispatch(fetchMisLibros(user.id)), solicitar, guardarLibro, alternarBaja }
}

export default useVendedor
