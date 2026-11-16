import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCompra } from '../redux/selectores'
import { Link } from 'react-router-dom'
import { useCompra } from '../hooks/useCompra'
import { abrirGate } from '../redux/userSlice'
import { categoriasDe, esUsado } from '../utils/libro'
import { coverBg, textOn } from '../utils/colors'
import Precio from './Precio'
import Letra from './Letra'

const moneda = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 })

const ProximaAventura = ({ libros, categorias }) => {
  const dispatch = useDispatch()
  const compra = useSelector(selectCompra)
  const { user } = compra
  const { agregar } = useCompra({ dispatch, ...compra })
  const [categoria, setCategoria] = useState('')
  const [estado, setEstado] = useState('todos')
  const [precioMaximo, setPrecioMaximo] = useState(0)
  const [libroElegido, setLibroElegido] = useState(null)
  const [librosProbados, setLibrosProbados] = useState([])
  const [etapa, setEtapa] = useState('cerrada')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [errorVideo, setErrorVideo] = useState(false)
  const dialogoRef = useRef(null)

  const disponibles = useMemo(() => libros.filter((libro) => {
    if (!(Number(libro.stock) > 0)) return false
    if (user?.rol === 'VENDEDOR' && libro.vId === user.id) return false
    if (categoria && !categoriasDe(libro).includes(categoria)) return false
    if (estado === 'nuevos' && esUsado(libro)) return false
    if (estado === 'usados' && !esUsado(libro)) return false
    if (precioMaximo > 0 && Number(libro.p) > precioMaximo) return false
    return true
  }), [libros, user, categoria, estado, precioMaximo])

  const sorpresasRestantes = useMemo(
    () => disponibles.filter((libro) => !librosProbados.includes(libro.id)),
    [disponibles, librosProbados],
  )

  const precioMayor = useMemo(
    () => Math.max(0, ...libros.map((libro) => Number(libro.p) || 0)),
    [libros],
  )

  useEffect(() => {
    if (!modalAbierto) return undefined
    dialogoRef.current?.focus()
    const cerrarConEscape = (event) => {
      if (event.key === 'Escape') setModalAbierto(false)
    }
    window.addEventListener('keydown', cerrarConEscape)
    return () => window.removeEventListener('keydown', cerrarConEscape)
  }, [modalAbierto])

  useEffect(() => {
    if (etapa !== 'abriendo') return undefined
    const timer = window.setTimeout(() => setEtapa('revelada'), 900)
    return () => window.clearTimeout(timer)
  }, [etapa])

  const prepararCaja = () => {
    if (!sorpresasRestantes.length) return
    const elegido = sorpresasRestantes[Math.floor(Math.random() * sorpresasRestantes.length)]
    setLibroElegido(elegido)
    setLibrosProbados((probados) => [...probados, elegido.id])
    setEtapa('video')
    setErrorVideo(false)
    setModalAbierto(true)
  }

  const abrirCaja = () => {
    if (etapa === 'caja') setEtapa('abriendo')
  }

  const sumarALaEstanteria = async () => {
    if (!user) {
      dispatch(abrirGate({ tipo: 'cart', destino: `/libro/${libroElegido.id}` }))
      return
    }
    await agregar(libroElegido)
  }

  const cambioFiltro = (cambiar) => (event) => {
    cambiar(event.target.value)
    setLibroElegido(null)
    setLibrosProbados([])
  }

  return (
    <section className="proxima-aventura" aria-labelledby="proxima-aventura-titulo">
      <div className="aventura-contenido">
        <div className="aventura-copy">
          <span className="aventura-eyebrow">Una sorpresa de EntreLibros</span>
          <h2 id="proxima-aventura-titulo">¿Cuál será tu próxima aventura?</h2>
          <p>Elegí hasta tres pistas. Abrí la caja y descubrí qué historia te está esperando.</p>

          <div className="aventura-filtros">
            <label>
              Género
              <select value={categoria} onChange={cambioFiltro(setCategoria)}>
                <option value="">Cualquier género</option>
                {categorias.map((nombre) => <option key={nombre} value={nombre}>{nombre}</option>)}
              </select>
            </label>
            <label>
              Estado
              <select value={estado} onChange={cambioFiltro(setEstado)}>
                <option value="todos">Nuevo o usado</option>
                <option value="nuevos">Nuevo</option>
                <option value="usados">Usado</option>
              </select>
            </label>
            <label className="aventura-precio">
              Precio máximo: {precioMaximo > 0 && precioMaximo < precioMayor ? `$${moneda.format(precioMaximo)}` : 'sin límite'}
              <input
                type="range"
                min="0"
                max={precioMayor || 1}
                step={Math.max(1, Math.round((precioMayor || 1) / 100))}
                value={precioMaximo}
                onChange={cambioFiltro(setPrecioMaximo)}
                aria-label="Precio máximo"
              />
            </label>
          </div>
          <p className="aventura-pistas">Hasta 3 filtros para dejar lugar a la sorpresa · {disponibles.length} {disponibles.length === 1 ? 'libro disponible' : 'libros disponibles'}</p>
          <button className="btn main aventura-boton" type="button" onClick={prepararCaja} disabled={!sorpresasRestantes.length}>
            Abrir mystery box
          </button>
          {!disponibles.length && <p className="aventura-sin-libros" role="status">No encontramos libros con esas pistas. Probá cambiando algún filtro.</p>}
          {disponibles.length > 0 && !sorpresasRestantes.length && <p className="aventura-sin-libros" role="status">Ya viste todas las opciones con estas pistas. Cambiá algún filtro para volver a probar.</p>}
        </div>

        <div className="aventura-escena aventura-caja-inicio">
          <button className="aventura-caja-abrir" type="button" onClick={prepararCaja} disabled={!sorpresasRestantes.length} aria-label="Abrir la mystery box de tu próxima aventura">
            <span className="aventura-caja">
              <span className="caja-tapa" />
              <span className="caja-frente"><i><Letra>?</Letra></i></span>
            </span>
          </button>
        </div>
      </div>

      {modalAbierto && (
        <div className="aventura-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalAbierto(false) }}>
          <section className="aventura-dialogo" role="dialog" aria-modal="true" aria-labelledby="aventura-dialogo-titulo" tabIndex={-1} ref={dialogoRef}>
            <button className="aventura-cerrar" type="button" onClick={() => setModalAbierto(false)} aria-label="Cerrar">×</button>
            {etapa !== 'video' && <span className="aventura-eyebrow">La caja misteriosa</span>}
            <h2 id="aventura-dialogo-titulo">
              {etapa === 'video' ? 'Acá viene tu próxima aventura…' : etapa === 'revelada' ? '¡Tu próxima aventura!' : 'Tocá la caja para descubrirla'}
            </h2>
            {etapa === 'video' && (
              <div className="aventura-video-wrap">
                {!errorVideo && (
                  <video
                    className="aventura-video"
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    onEnded={() => setEtapa('caja')}
                    onError={() => setErrorVideo(true)}
                    aria-label="Un gatito juega con una caja misteriosa"
                  >
                    <source src={`${import.meta.env.BASE_URL}videos/proxima-aventura-gatito.mp4`} type="video/mp4" />
                  </video>
                )}
                {errorVideo && <p className="aventura-video-error" role="status">No se pudo reproducir el video. Podés seguir con la caja misteriosa.</p>}
                <button className="btn alt aventura-boton" type="button" onClick={() => setEtapa('caja')}>{errorVideo ? 'Continuar' : 'Saltar video'}</button>
              </div>
            )}
            {(etapa === 'caja' || etapa === 'abriendo') && (
              <div className="aventura-caja-escena">
                <button
                  className={`aventura-caja-abrir aventura-caja-interactiva${etapa === 'caja' ? ' temblando' : ' abriendo'}`}
                  type="button"
                  onClick={abrirCaja}
                  disabled={etapa !== 'caja'}
                  aria-label="Abrir la caja misteriosa"
                >
                  <span className="aventura-caja">
                    <span className="caja-tapa" />
                    <span className="caja-frente"><i><Letra>?</Letra></i></span>
                  </span>
                </button>
              </div>
            )}
            {etapa === 'revelada' && libroElegido && (
              <>
                <div className="aventura-caja-revelada" aria-hidden="true">
                  <span className="aventura-caja">
                    <span className="caja-tapa" />
                    <span className="caja-frente"><i>?</i></span>
                  </span>
                </div>
                <div className="aventura-resultado">
                  <Link to={`/libro/${libroElegido.id}`} className="aventura-libro">
                    <span className="aventura-portada" style={{ background: coverBg(libroElegido), color: textOn(libroElegido.c) }}>
                      {!libroElegido.imgs?.[0] && <b>{libroElegido.t}</b>}
                    </span>
                    <span className="aventura-info">
                      <strong>{libroElegido.t}</strong>
                      <small>{libroElegido.a}</small>
                      <span><Precio libro={libroElegido} /></span>
                    </span>
                  </Link>
                  <div className="aventura-acciones">
                    {sorpresasRestantes.length > 0 && (
                      <button className="btn alt aventura-boton" type="button" onClick={prepararCaja}>
                        Probar otra sorpresa ({sorpresasRestantes.length} {sorpresasRestantes.length === 1 ? 'restante' : 'restantes'})
                      </button>
                    )}
                    {user?.rol === 'ADMIN'
                      ? <Link className="btn main aventura-boton" to={`/libro/${libroElegido.id}`}>Ver libro</Link>
                      : <button className="btn main aventura-boton" type="button" onClick={sumarALaEstanteria}>Añadir a mi estantería</button>}
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </section>
  )
}

export default ProximaAventura