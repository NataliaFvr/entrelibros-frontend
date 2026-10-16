import { useMemo, useState } from 'react'
import { useLibros } from '../hooks/useLibros'
import useFormulario from '../hooks/useFormulario'
import useImagenesLibro from '../hooks/useImagenesLibro'
import { IDIOMA_POR_DEFECTO, opcionesIdioma } from '../data/idiomas'
import { mapearCampos, normalizarError } from '../utils/errorApi'
import { categoriasDe } from '../utils/libro'
import { canonico, valoresFrecuentes } from '../utils/sugerencias'
import { CAMPOS_LIBRO } from '../utils/libroRequest'
import Aviso from './Aviso'
import Field from './Field'
import CategoriasField from './CategoriasField'
import SugerenciasField from './SugerenciasField'
import SelectField from './SelectField'
import TextAreaField from './TextAreaField'
import ImageUploader from './ImageUploader'

const desdeLibro = (p) => ({
  titulo: p.t || '', autor: p.a || '', editorial: p.ed || '', cats: categoriasDe(p), idioma: p.idioma || IDIOMA_POR_DEFECTO, anio: String(p.anio || ''),
  estadoLibro: p.usado ? 'Usado' : 'Nuevo', descripcion: p.descripcion || '', precio: String(p.base || ''), descuentoPct: String(p.d || 0), stock: p.stock == null ? '' : String(p.stock),
})

// Publicar o editar (`libro`). El backend decide si los datos son válidos.
const BookForm = ({ libro = {}, onGuardar, onCancelar }) => {
  const { categorias, libros } = useLibros()
  // Editoriales y autores que ya hay en el catálogo: se ofrecen como sugerencias para que todos escriban el mismo nombre
  const editoriales = useMemo(() => valoresFrecuentes(libros, 'ed'), [libros])
  const autores = useMemo(() => valoresFrecuentes(libros, 'a'), [libros])
  const { valores, cambiar, errores, setErroresCampos, error, tipoError, setError } = useFormulario(
    desdeLibro(libro),
  )
  const imagenes = useImagenesLibro(libro.imgs || [])
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    if (enviando) return
    // El libro se crea primero y las fotos se suben después, así que la foto obligatoria se pide acá:
    // sin ella el administrador no lo puede aprobar
    if (!imagenes.fotos.length) {
      setError('Agregá al menos una foto del libro.')
      return
    }
    setError('')
    setEnviando(true)
    try {
      // Las categorías van en el orden de la lista oficial: así la que se muestra en las tarjetas es la misma antes y después de recargar
      const enOrden = categorias.filter((c) => valores.cats.includes(c))
      // `onGuardar` puede devolver { error } (validación del servidor) o lanzar un error de red/HTTP
      const respuesta = await onGuardar({
        t: valores.titulo.trim(), a: canonico(autores, valores.autor), ed: canonico(editoriales, valores.editorial), cat: enOrden[0], cats: enOrden, idioma: valores.idioma,
        anio: Number(valores.anio), usado: valores.estadoLibro === 'Usado', base: Number(valores.precio), d: Number(valores.descuentoPct),
        stock: Number(valores.stock), imgs: imagenes.fotos, descripcion: valores.descripcion.trim(),
      })
      if (respuesta && respuesta.error) setError(respuesta.error, 'CONFLICTO')
    } catch (err) {
      // 400/409/5xx de la API: los errores por campo se pintan en cada input y el resto va en el aviso
      const info = normalizarError(err, 'libro')
      setErroresCampos(mapearCampos(info.campos, CAMPOS_LIBRO))
      setError(info.mensaje, info.tipo)
    } finally {
      setEnviando(false)
    }
  }

  const props = (nombre) => ({ name: nombre, value: valores[nombre], onChange: cambiar, error: errores[nombre] })
  return (
    <form className="card aform" noValidate onSubmit={enviar}>
      <h3 className="fr">{libro.id ? 'Editar libro' : 'Publicar libro'}</h3>
      <Field label="Título" {...props('titulo')} />
      <div className="two">
        <SugerenciasField label="Autor" sugerencias={autores} minimo={2} maximo={5} {...props('autor')} />
        <SugerenciasField label="Editorial" sugerencias={editoriales} maximo={8} {...props('editorial')} />
      </div>
      <div className="two">
        <SelectField label="Idioma" {...props('idioma')} opciones={opcionesIdioma(libro.idioma)} />
        <SelectField label="Estado" {...props('estadoLibro')} opciones={['Nuevo', 'Usado']} />
      </div>
      <CategoriasField {...props('cats')} opciones={categorias} />
      <div className="two">
        <Field label="Año de edición" type="number" {...props('anio')} />
        <Field label="Stock" type="number" {...props('stock')} />
      </div>
      <div className="two">
        <Field label="Precio ($)" type="number" {...props('precio')} />
        <Field label="Descuento (%)" type="number" {...props('descuentoPct')} />
      </div>
      <TextAreaField label="Descripción (opcional)" name="descripcion" value={valores.descripcion} onChange={cambiar} rows={5}
        placeholder="Contá de qué trata el libro y, si es usado, en qué estado está. Si la dejás vacía, la ficha no muestra descripción." />
      <ImageUploader imagenes={imagenes} />
      <Aviso mensaje={error} tipo={tipoError} />
      <div className="rvf-b">
        <button className="btn main" type="submit" disabled={enviando}>{enviando ? 'Enviando…' : libro.id ? 'Guardar cambios' : 'Publicar'}</button>
        {libro.id && <button className="btn alt" type="button" onClick={onCancelar}>Cancelar</button>}
      </div>
    </form>
  )
}

export default BookForm
