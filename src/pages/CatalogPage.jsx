import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getCatalogoApi, getFiltrosDisponiblesApi } from '../api/librosApi'
import { listarCategoriasApi } from '../api/categoriasApi'
import { useAuth } from '../hooks/useAuth'
import useFiltros from '../hooks/useFiltros'
import { filtrosDesdeURL } from '../utils/filtrosURL'
import { plural } from '../utils/format'
import SortSelect from '../componentes/SortSelect'
import ActiveChips from '../componentes/ActiveChips'
import FilterSidebar from '../componentes/FilterSidebar'
import ProductGrid from '../componentes/ProductGrid'
import SearchNoResults from '../componentes/SearchNoResults'
import Pager from '../componentes/Pager'

const Catalogo = ({ inicial, categorias, filtros }) => {
  const { user, direcciones } = useAuth()
  const { f, set, setPage, toggle, limpiar } = useFiltros(inicial)
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)
  const [resultado, setResultado] = useState({ libros: [], total: 0, pages: 0 })
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)
  const solicitudActual = useRef(0)
  const provinciaDireccion = ((direcciones || []).find((d) => d.principal) || (direcciones || [])[0])?.prov || user?.provincia
  // Sin dirección, la provincia la elige la persona en el filtro de envíos (no hace falta cuenta)
  const [provinciaElegida, setProvinciaElegida] = useState('')
  const provinciaComprador = provinciaDireccion || provinciaElegida

  const cargar = () => {
    const solicitud = ++solicitudActual.current
    setCargando(true)
    setError(false)
    return getCatalogoApi(f, { categorias, filtros, provinciaComprador })
      // Al cambiar varios filtros, la petición anterior puede terminar después.
      // Solo la última puede actualizar la grilla.
      .then((data) => { if (solicitud === solicitudActual.current) setResultado(data) })
      .catch(() => {
        if (solicitud === solicitudActual.current) {
          setResultado({ libros: [], total: 0, pages: 0 })
          setError(true)
        }
      })
      .finally(() => { if (solicitud === solicitudActual.current) setCargando(false) })
  }
  useEffect(() => { cargar() }, [f, categorias, filtros, provinciaComprador]) // eslint-disable-line react-hooks/exhaustive-deps

  const topIds = useMemo(() => new Set(
    f.sort === 'best' && f.page === 1 ? resultado.libros.filter((l) => !l.usado).slice(0, 6).map((l) => l.id) : [],
  ), [f.page, f.sort, resultado.libros])
  const sinCoincidencias = Boolean(f.q && !resultado.total && !error)

  const pages = Math.max(1, resultado.pages)
  const page = Math.min(f.page, pages)

  const cambiarPagina = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <main className="cat">
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
  const [datos, setDatos] = useState({ categorias: [], filtros: null })
  useEffect(() => {
    Promise.all([listarCategoriasApi(), getFiltrosDisponiblesApi()])
      .then(([categorias, filtros]) => setDatos({ categorias, filtros }))
      .catch(() => setDatos({ categorias: [], filtros: {} }))
  }, [])
  if (!datos.filtros) return <main className="cat" />
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
