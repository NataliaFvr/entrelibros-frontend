import { useEffect, useState } from 'react'
import { fuenteModeracion as fuente } from '../api/moderacionApi'

const POR_PAGINA_HISTORIAL = 10
const VACIO = { content: [], totalElements: 0, totalPages: 0 }

// Historial de moderación (solo ADMIN). Sin `libro` trae todo el historial (GET /libros/historial-moderacion);
// con `libro` { id, titulo } trae el de ese libro (GET /libros/{id}/historial-moderacion). El back pagina desde 0.
const useHistorialModeracion = (libro) => {
  const idLibro = libro ? libro.id : null
  const [pagina, setPagina] = useState(1)
  const [estado, setEstado] = useState({ clave: '', datos: VACIO, error: '' })
  const [intento, setIntento] = useState(0)

  // Un cambio de libro vuelve a la primera página (se ajusta durante el render, sin efecto)
  const [libroPrevio, setLibroPrevio] = useState(idLibro)
  if (libroPrevio !== idLibro) {
    setLibroPrevio(idLibro)
    setPagina(1)
  }

  const clave = `${idLibro}:${pagina}:${intento}`
  useEffect(() => {
    let vigente = true
    const pedido = idLibro == null
      ? fuente.obtenerHistorial(pagina - 1, POR_PAGINA_HISTORIAL)
      : fuente.obtenerHistorialDeLibro(idLibro, pagina - 1, POR_PAGINA_HISTORIAL)
    pedido
      .then((datos) => { if (vigente) setEstado({ clave, datos: datos || VACIO, error: '' }) })
      .catch((err) => {
        if (vigente) setEstado({ clave, datos: VACIO, error: (err && err.message) || 'No pudimos cargar el historial. Intentá de nuevo.' })
      })
    return () => { vigente = false }
  }, [clave, idLibro, pagina])

  return {
    registros: estado.datos.content || [],
    total: estado.datos.totalElements || 0,
    paginas: Math.max(1, estado.datos.totalPages || 1),
    pagina,
    setPagina,
    cargando: estado.clave !== clave, // la respuesta guardada no es la de esta página/libro todavía
    error: estado.clave === clave ? estado.error : '',
    reintentar: () => setIntento((n) => n + 1),
  }
}

export default useHistorialModeracion
