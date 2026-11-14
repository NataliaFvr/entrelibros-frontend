import { mostrarToast } from '../redux/toastSlice'
import { useEffect, useMemo } from 'react'
import { urlImagenCategoria } from '../api/categoriasApi'
import { cambiarEstadoCategoria, crearCategoria, editarCategoria, fetchCategoriasAdmin, fetchLibros } from '../redux/librosSlice'

// Categorías del panel (activas y de baja). Cada acción devuelve { ok } o { error }.
const useAdminCategorias = ({ dispatch, categoriasState }) => {
  const toast = (msg, accion) => dispatch(mostrarToast({ msg, accion }))
  const { todas, todasCargadas } = categoriasState

  useEffect(() => {
    if (!todasCargadas) dispatch(fetchCategoriasAdmin())
  }, [dispatch, todasCargadas])

  const categorias = useMemo(
    () => todas.map((c) => ({ nombre: c.nombre, imagen: c.tieneImagen ? urlImagenCategoria(c.id) : '', activa: c.activa })),
    [todas],
  )

  const correr = async (accion, aviso) => {
    const resultado = await dispatch(accion)
    if (resultado.error) return { error: resultado.error.message }
    toast(aviso)
    if (resultado.payload.aviso) toast(resultado.payload.aviso)
    return { ok: true }
  }

  const cambiarEstado = async (nombre, activa) => {
    const r = await correr(cambiarEstadoCategoria({ nombre, activa }), activa ? 'Categoría reactivada' : 'Categoría dada de baja')
    // Cambia el estado de muchos libros y el back solo devuelve la categoría: hay que pedir el catálogo
    if (r.ok) dispatch(fetchLibros())
    return r
  }

  return {
    categorias,
    crear: (datos) => correr(crearCategoria(datos), 'Categoría creada'),
    editar: (actual, datos) => correr(editarCategoria({ actual, ...datos }), 'Categoría actualizada'),
    darDeBaja: (nombre) => cambiarEstado(nombre, false),
    reactivar: (nombre) => cambiarEstado(nombre, true),
  }
}

export default useAdminCategorias
