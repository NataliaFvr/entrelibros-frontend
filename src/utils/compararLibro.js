import { fmt } from './format'

const dash = (v) => (v === null || v === undefined || v === '' ? '—' : v)

// [campo de DatosLibro, etiqueta, cómo mostrar el valor]
export const CAMPOS_COMPARADOS = [
  ['titulo', 'Título'],
  ['autor', 'Autor'],
  ['editorial', 'Editorial'],
  ['idioma', 'Idioma'],
  ['anio', 'Año'],
  ['estadoLibro', 'Estado', (v) => (v === 'USADO' ? 'Usado' : v === 'NUEVO' ? 'Nuevo' : dash(v))],
  ['precio', 'Precio', (v) => (typeof v === 'number' ? fmt(v) : '—')],
  ['descuentoPct', 'Descuento', (v) => (typeof v === 'number' ? `${v}%` : '—')],
  ['stock', 'Stock'],
  ['descripcion', 'Descripción'],
  ['imagenUrl', 'Imagen'],
]

export const textoCampo = (campo, valor) => {
  const f = CAMPOS_COMPARADOS.find(([k]) => k === campo)
  return f && f[2] ? f[2](valor) : dash(valor)
}

// Campos de `propuestos` que difieren de `actuales` (Set de nombres). Sin `actuales` no hay nada que comparar.
export const camposCambiados = (actuales, propuestos) => {
  if (!actuales) return new Set()
  const igual = (a, b) => (a ?? null) === (b ?? null)
  return new Set(CAMPOS_COMPARADOS.map(([k]) => k).filter((k) => !igual(actuales[k], propuestos[k])))
}
