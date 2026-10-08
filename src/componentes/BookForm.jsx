import { useMemo, useState } from 'react'
import { useLibros } from '../hooks/useLibros'
import useFormulario from '../hooks/useFormulario'
import useImagenesLibro from '../hooks/useImagenesLibro'
import { IDIOMA_POR_DEFECTO, opcionesIdioma } from '../data/idiomas'
import { MIN_FOTOS } from '../utils/imagen'
import { mapearCampos, normalizarError } from '../utils/errorApi'
import { categoriasDe } from '../utils/libro'
import { canonico, valoresFrecuentes } from '../utils/sugerencias'
import { propsNumero } from '../utils/entradaNumerica'
import { CAMPOS_LIBRO } from '../utils/libroRequest'
import { ANIO_MIN, aDecimal, anioActual, validadoresLibro } from '../utils/validaciones'
import Aviso from './Aviso'
import Field from './Field'
import CategoriasField from './CategoriasField'
import SugerenciasField from './SugerenciasField'
import SelectField from './SelectField'
import TextAreaField from './TextAreaField'
import ImageUploader from './ImageUploader'

const desdeLibro = (p) => ({
  t: p.t || '', a: p.a || '', ed: p.ed || '', cats: categoriasDe(p), idioma: p.idioma || IDIOMA_POR_DEFECTO, anio: String(p.anio || ''),
  estado: p.usado ? 'Usado' : 'Nuevo', descripcion: p.descripcion || '', base: String(p.base || ''), d: String(p.d || 0), stock: String(p.usado ? 1 : p.stock || 1),
})

// Año, precio, descuento y stock se validan mientras se escribe; el resto, al salir del campo
const EN_VIVO = ['anio', 'base', 'd', 'stock']

// Publicar o editar (`libro`). Al guardar entra en revisión del administrador.
// Las reglas espejan LibroRequest del back: anioPublicacion entero 1900..año actual, precio > 0 con hasta 2 decimales,
// descuento entero 0..100 e idioma de un catálogo fijo.
const BookForm = ({ libro = {}, onGuardar, onCancelar }) => {
  const { categorias, libros } = useLibros()
  // Editoriales y autores que ya hay en el catálogo: se ofrecen como sugerencias para que todos escriban el mismo nombre
  const editoriales = useMemo(() => valoresFrecuentes(libros, 'ed'), [libros])
  const autores = useMemo(() => valoresFrecuentes(libros, 'a'), [libros])
  const { valores, cambiar, errores, alSalir, validarTodo, setErroresCampos, error, tipoError, setError } = useFormulario(
    { ...desdeLibro(libro), cats: categoriasDe(libro).length ? categoriasDe(libro) : categorias.slice(0, 1) }, validadoresLibro, { enVivo: EN_VIVO },
  )
  const imagenes = useImagenesLibro(libro.imgs || [])
  const [enviando, setEnviando] = useState(false)
  const usado = valores.estado === 'Usado'

  const alCambiar = (nombre, valor) => {
    cambiar(nombre, valor)
    if (nombre === 'estado' && valor === 'Usado') cambiar('stock', '1') // los usados tienen 1 unidad
  }

  const enviar = async (e) => {
    e.preventDefault()
    if (enviando) return
    const malos = validarTodo(e.currentTarget) // el primer campo con error recibe el foco
    if (Object.keys(malos).length) return setError('Revisá los campos marcados en rojo antes de publicar.')
    if (imagenes.fotos.length < MIN_FOTOS) return setError('Subí al menos una foto del libro.')
    setError('')
    setEnviando(true)
    try {
      // Las categorías van en el orden de la lista oficial: así la que se muestra en las tarjetas es la misma antes y después de recargar
      const enOrden = categorias.filter((c) => valores.cats.includes(c))
      // `onGuardar` puede devolver { error } (validación del servidor) o lanzar un error de red/HTTP
      const respuesta = await onGuardar({
        t: valores.t.trim(), a: canonico(autores, valores.a), ed: canonico(editoriales, valores.ed), cat: enOrden[0], cats: enOrden, idioma: valores.idioma,
        anio: parseInt(valores.anio, 10), usado, base: aDecimal(valores.base), d: parseInt(valores.d, 10),
        stock: usado ? 1 : parseInt(valores.stock, 10), imgs: imagenes.fotos, descripcion: valores.descripcion.trim(),
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

  const props = (nombre) => ({ name: nombre, value: valores[nombre], onChange: alCambiar, onBlur: alSalir, error: errores[nombre] })

  return (
    <form className="card aform" noValidate onSubmit={enviar}>
      <h3 className="fr">{libro.id ? 'Editar libro' : 'Publicar libro'}</h3>
      <Field label="Título" {...props('t')} />
      <div className="two">
        <SugerenciasField label="Autor" sugerencias={autores} minimo={2} maximo={5} {...props('a')} />
        <SugerenciasField label="Editorial" sugerencias={editoriales} maximo={8} {...props('ed')} />
      </div>
      <div className="two">
        <SelectField label="Idioma" {...props('idioma')} opciones={opcionesIdioma(libro.idioma)} />
        <SelectField label="Estado" {...props('estado')} opciones={['Nuevo', 'Usado']} />
      </div>
      <CategoriasField {...props('cats')} opciones={categorias} />
      <div className="two">
        <Field label={`Año de edición (${ANIO_MIN}–${anioActual()})`} type="number" min={ANIO_MIN} max={anioActual()} step="1" {...propsNumero('entero')} {...props('anio')} />
        <Field label="Stock (los usados: 1 unidad)" type="number" min="1" step="1" {...propsNumero('entero')} {...props('stock')} readOnly={usado} />
      </div>
      <div className="two">
        <Field label="Precio ($, hasta 2 decimales)" type="number" min="0.01" step="0.01" {...propsNumero('decimal')} {...props('base')} />
        <Field label="Descuento (%, de 0 a 100)" type="number" min="0" max="100" step="1" {...propsNumero('entero')} {...props('d')} />
      </div>
      <TextAreaField label="Descripción (opcional)" name="descripcion" value={valores.descripcion} onChange={alCambiar} maxLength={1000} rows={5}
        placeholder="Contá de qué trata el libro y, si es usado, en qué estado está. Si la dejás vacía, la ficha no muestra descripción." />
      <small className="iu-hint" style={{ marginTop: -8 }}>{valores.descripcion.length} / 1000</small>
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
