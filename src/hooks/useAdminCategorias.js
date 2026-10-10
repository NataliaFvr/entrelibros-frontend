import { useCallback, useEffect, useState } from 'react'
import { useLibros } from './useLibros'
import { useToast } from './useToast'
import { cambiarEstadoCategoria, crearCategoriaConFoto, editarCategoria, listarCategoriasAdmin } from '../api/categoriasApiExtra'

// Categorías del panel (activas y de baja) con alta, edición y baja/reactivación. Cada acción devuelve { ok } o { error }.
const useAdminCategorias = () => {
  const toast = useToast()
  const { recargar, recargarCategorias } = useLibros()
  const [categorias, setCategorias] = useState([])

  const leer = useCallback(() => listarCategoriasAdmin().then(setCategorias), [])
  useEffect(() => {
    let vigente = true
    listarCategoriasAdmin().then((c) => { if (vigente) setCategorias(c) })
    return () => { vigente = false }
  }, [])

  const correr = async (fn, aviso) => {
    try {
      await fn()
      await Promise.all([leer(), recargarCategorias(), recargar()]) // el catálogo y el inicio se actualizan al instante
      toast(aviso)
      return { ok: true }
    } catch (err) {
      return { error: (err && err.message) || 'No pudimos guardar la categoría. Intentá de nuevo.' }
    }
  }

  const crear = (datos) => correr(() => crearCategoriaConFoto(datos), 'Categoría creada')
  const editar = (actual, datos) => correr(() => editarCategoria(actual, datos), 'Categoría actualizada')
  const darDeBaja = (nombre) => correr(() => cambiarEstadoCategoria(nombre, false), 'Categoría dada de baja')
  const reactivar = (nombre) => correr(() => cambiarEstadoCategoria(nombre, true), 'Categoría reactivada')

  return { categorias, crear, editar, darDeBaja, reactivar }
}

export default useAdminCategorias
