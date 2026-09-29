import EstadoFilter from './EstadoFilter'
import EnvioFilter from './EnvioFilter'
import CategoriasFilter from './CategoriasFilter'
import PriceFilter from './PriceFilter'
import SelectFilter from './SelectFilter'

const DESCUENTOS = [['1', 'Con descuento'], ['10', '10% o más'], ['20', '20% o más'], ['30', '30% o más']]
const ANIOS = [['2020', '2020 o después'], ['2010', '2010 o después'], ['2000', '2000 o después'], ['0', 'Antes del 2000']]
const unicos = (libros, k) => [...new Set(libros.map((l) => l[k]))].sort()

// `f` = filtros actuales, `set(cambios)` = actualiza, `toggle(clave, valor)` = agrega/quita de un array
export default function FilterSidebar({ f, set, toggle, libros, categorias, abierto }) {
  return (
    <aside className={`filters${abierto ? ' open' : ''}`}>
      <EstadoFilter value={f.estado} onChange={(estado) => set({ estado })} />
      <EnvioFilter value={f.envios} onToggle={(v) => toggle('envios', v)} />
      <CategoriasFilter categorias={categorias} value={f.cats} onToggle={(c) => toggle('cats', c)} />
      <PriceFilter min={f.min} max={f.max} onChange={(min, max) => set({ min, max })} />
      <SelectFilter titulo="Descuento" primera="Todos" opciones={DESCUENTOS} value={f.desc ? String(f.desc) : ''}
        onChange={(v) => set({ desc: +v })} />
      <SelectFilter titulo="Editorial" primera="Todas" opciones={unicos(libros, 'ed')} value={f.ed} onChange={(ed) => set({ ed })} />
      <SelectFilter titulo="Autor" primera="Todos" opciones={unicos(libros, 'a')} value={f.autor} onChange={(autor) => set({ autor })} />
      <SelectFilter titulo="Idioma" primera="Todos" opciones={unicos(libros, 'idioma')} value={f.idioma} onChange={(idioma) => set({ idioma })} />
      <SelectFilter titulo="Año de edición" primera="Cualquiera" opciones={ANIOS} value={f.anio} onChange={(anio) => set({ anio })} />
      <SelectFilter titulo="Vendedor" primera="Todos" opciones={unicos(libros, 'v')} value={f.vendedor} onChange={(vendedor) => set({ vendedor })} />
    </aside>
  )
}
