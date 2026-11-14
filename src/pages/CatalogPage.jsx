import { useEffect, useMemo, useRef, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import {
  claveBusqueda, fetchFiltrosDisponibles, fetchPagina, limpiarFiltros, reiniciarFiltros, setFiltros, setPagina, toggleFiltro,
} from '../redux/librosSlice'
import { filtrosDesdeURL } from '../utils/filtrosURL'
import { plural } from '../utils/format'
import SortSelect from '../componentes/SortSelect'
import ActiveChips from '../componentes/ActiveChips'
import FilterSidebar from '../componentes/FilterSidebar'
import ProductGrid from '../componentes/ProductGrid'
import SearchNoResults from '../componentes/SearchNoResults'
import Pager from '../componentes/Pager'

const VACIO = { libros: [], total: 0, pages: 0 }

const Catalogo = ({ inicial, categorias, filtros }) => {
  const dispatch = useDispatch()
  const {user, direcciones}=useSelector(s=>s.user)
  const filtrosElegidos = useSelector((state) => state.libros.filtrosElegidos)
  const [inicializado, setInicializado] = useState(false)
  const f = inicializado ? filtrosElegidos : inicial
  const set = (cambios) => dispatch(setFiltros(cambios))
  const setPage = (page) => dispatch(setPagina(page))
  const toggle = (clave, valor) => dispatch(toggleFiltro({ clave, valor }))
  const limpiar = () => dispatch(limpiarFiltros({ min: inicial.min, max: inicial.max }))
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)
  const provinciaDireccion = ((direcciones || []).find((d) => d.principal) || (direcciones || [])[0])?.prov || user?.provincia
  // Sin dirección, la provincia la elige la persona en el filtro de envíos (no hace falta cuenta)
  const [provinciaElegida, setProvinciaElegida] = useState('')
  const provinciaComprador = provinciaDireccion || provinciaElegida

  useEffect(() => {
    dispatch(reiniciarFiltros(inicial))
    setInicializado(true)
  }, [dispatch])

  const clave = claveBusqueda(f, provinciaComprador)
  const guardada = useSelector((state) => state.libros.catalogo.paginas[clave])
  const error = useSelector((state) => Boolean(state.libros.catalogo.errores[clave]))
  const cargar = () => dispatch(fetchPagina({ clave, f, provinciaComprador }))

  useEffect(() => {
    if (!guardada && !error) dispatch(fetchPagina({ clave, f, provinciaComprador }))
  }, [dispatch, clave, guardada, error, f, provinciaComprador])

  // Mientras llega una búsqueda nueva se sigue viendo la anterior
  const [mostrada, setMostrada] = useState(VACIO)
  if (guardada && guardada !== mostrada) setMostrada(guardada)
  const resultado = error ? VACIO : guardada || mostrada
  const cargando = !guardada && !error

  const topIds = useMemo(() => new Set(
    f.sort === 'best' && f.page === 1 ? resultado.libros.filter((l) => !l.usado).slice(0, 6).map((l) => l.id) : [],
  ), [f.page, f.sort, resultado.libros])
  const sinCoincidencias = Boolean(f.q && !resultado.total && !error)

  const pages = Math.max(1, resultado.pages)
  const page = Math.min(f.page, pages)

  const arriba = useRef(null)
  const cambiarPagina = (p) => { setPage(p); arriba.current?.scrollIntoView({ block: 'start' }) }

  return (
    <main className="cat" ref={arriba}>
      <div className="crumbs"><Link to="/">Inicio</Link> › <span>Libros</span></div>
      <div className="cat-top">
        <div>
          <h1>Libros</h1>
          <p>{resultado.total.toLocaleString('es-AR')} {plural(resultado.total, 'resultado', 'resultados')}</p>
        </div>
        <SortSelect value={f.sort} onChange={(sort) => set({ sort })} />
      </div>
      <ActiveChips f={f} set={set} toggle={toggle} onLimpiar={limpiar} precioMinimo={filtros.precioMin ?? 0} precioMaximo={filtros.precioMax ?? 500} />
      <button className="filters-btn" type="button" aria-expanded={filtrosAbiertos} aria-controls="filtros-catalogo" onClick={() => setFiltrosAbiertos((v) => !v)}>
        {filtrosAbiertos ? 'Ocultar filtros' : 'Filtros'}
      </button>
      <div className="cat-layout">
        <FilterSidebar f={f} set={set} toggle={toggle} categorias={categorias.map((c) => c.nombre)} filtros={filtros} abierto={filtrosAbiertos} envio={{ provincia: provinciaComprador, desdeDireccion: Boolean(provinciaDireccion), onProvincia: setProvinciaElegida }} />
        <div>
          {sinCoincidencias ? (
            <SearchNoResults termino={f.q.trim()} destacados={[]} onLimpiar={limpiar} />
          ) : (
            <>
              <ProductGrid libros={resultado.libros} topIds={topIds} ordenPorVentas={f.sort === 'best'} onLimpiar={limpiar} error={error} onReintentar={cargar} />
              {!cargando && <Pager page={page} pages={pages} onChange={cambiarPagina} />}
            </>
          )}
        </div>
      </div>
    </main>
  )
}

// Al cambiar la URL (menú, buscador, "Ver todo") se reinician los filtros desde la nueva búsqueda
const CatalogPage = () => {
  const { search, key } = useLocation()
  const dispatch = useDispatch()
  const categorias = useSelector((state) => state.libros.categorias.items)
  const cargandoCategorias = useSelector((state) => state.libros.categorias.loading)
  const filtros = useSelector((state) => state.libros.catalogo.filtros)

  useEffect(() => {
    if (!filtros) dispatch(fetchFiltrosDisponibles())
  }, [dispatch, filtros])

  if (!filtros || cargandoCategorias) return <main className="cat" />
  const datos = { categorias, filtros }
  const base = filtrosDesdeURL(search, datos.categorias.map((c) => c.nombre))
  // La URL trae el NOMBRE del vendedor; el selector trabaja con su ID. Se resuelve acá para que ambos queden sincronizados.
  const vendedor = (datos.filtros.vendedores || []).find((v) => v.nombre === base.vendedor)
  const inicial = {
    ...base,
    vendedorId: vendedor ? String(vendedor.id) : '',
    min: datos.filtros.precioMin ?? 0,
    max: datos.filtros.precioMax ?? 500,
  }
  // key = clave de la navegación: elegir otra vez el mismo enlace del menú también reinicia los filtros
  return <Catalogo key={key} inicial={inicial} {...datos} />
}

export default CatalogPage
