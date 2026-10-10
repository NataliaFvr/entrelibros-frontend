import EstadoFilter from './EstadoFilter'
import EnvioFilter from './EnvioFilter'
import CategoriasFilter from './CategoriasFilter'
import PriceFilter from './PriceFilter'
import SelectFilter from './SelectFilter'

const DESCUENTOS = [['1', 'Con descuento'], ['10', '10% o más'], ['20', '20% o más'], ['30', '30% o más']]
const ANIOS = [['2020', '2020 o después'], ['2010', '2010 o después'], ['2000', '2000 o después'], ['0', 'Antes del 2000']]
// `f` = filtros actuales, `set(cambios)` = actualiza, `toggle(clave, valor)` = agrega/quita de un array
const FilterSidebar = ({ f, set, toggle, categorias, filtros, abierto, envioDisponible = true }) => {
  return (
    <aside className={`filters${abierto ? ' open' : ''}`}>
      <EstadoFilter value={f.estado} onChange={(estado) => set({ estado })} />
      <EnvioFilter value={f.envios} onToggle={(v) => toggle('envios', v)} disabled={!envioDisponible} />
      <CategoriasFilter categorias={categorias} value={f.cats} onToggle={(c) => toggle('cats', c)} />
      <PriceFilter min={f.min} max={f.max} minimo={filtros.precioMin} maximo={filtros.precioMax} onChange={(min, max) => set({ min, max })} />
      <SelectFilter titulo="Descuento" primera="Todos" opciones={DESCUENTOS} value={f.desc ? String(f.desc) : ''}
        onChange={(v) => set({ desc: +v })} />
      <SelectFilter titulo="Editorial" primera="Todas" opciones={filtros.editoriales || []} value={f.ed} onChange={(ed) => set({ ed })} />
      <SelectFilter titulo="Autor" primera="Todos" opciones={filtros.autores || []} value={f.autor} onChange={(autor) => set({ autor })} />
      <SelectFilter titulo="Idioma" primera="Todos" opciones={filtros.idiomas || []} value={f.idioma} onChange={(idioma) => set({ idioma })} />
      <SelectFilter titulo="Año de edición" primera="Cualquiera" opciones={ANIOS} value={f.anio} onChange={(anio) => set({ anio })} />
      <SelectFilter titulo="Vendedor" primera="Todos" opciones={(filtros.vendedores || []).map((v) => [String(v.id), v.nombre])} value={f.vendedorId}
        onChange={(vendedorId) => {
          const vendedor = (filtros.vendedores || []).find((v) => String(v.id) === vendedorId)
          set({ vendedorId, vendedor: vendedor?.nombre || '' })
        }} />
    </aside>
  )
}

export default FilterSidebar
