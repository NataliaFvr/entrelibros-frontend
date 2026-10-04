import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import GateColumn from './GateColumn'
import { SHELF_PATH } from './Icons'

const MENSAJES = {
  cart: 'Para ver tu estantería y comprar, entrá a tu cuenta.',
  fav: 'Para guardar libros en tu Marcapáginas, entrá a tu cuenta.',
  review: 'Para opinar sobre un libro, entrá a tu cuenta.',
  sell: 'Para vender primero tenés que entrar a tu cuenta de comprador.',
  account: 'Para ver tu perfil y tus compras, entrá a tu cuenta.',
}

// Modal "¿Empezamos un nuevo capítulo?": aparece al intentar una acción que pide sesión
const LoginGate = () => {
  const { gate, gateDestino, cerrarGate } = useAuth()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  useEffect(() => {
    if (!gate) return
    const alEscape = (e) => { if (e.key === 'Escape') cerrarGate() }
    window.addEventListener('keydown', alEscape)
    return () => window.removeEventListener('keydown', alEscape)
  }, [gate, cerrarGate])

  if (!gate) return null

  // Al entrar, el login te lleva al destino pedido o, si no hay, a la página desde la que llegaste
  const ir = (ruta) => {
    const from = gateDestino || pathname + search
    cerrarGate()
    navigate(ruta, { state: { from } })
  }

  return (
    <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) cerrarGate() }}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="gt">
        <button className="modal-x" type="button" aria-label="Cerrar" onClick={cerrarGate}>✕</button>
        <h2 className="fr" id="gt">¿Empezamos un nuevo capítulo?</h2>
        <p className="modal-msg">{MENSAJES[gate] || MENSAJES.cart}</p>
        <div className="modal-cols">
          <GateColumn color="#EF7B45" glyph="M6 3h12v18l-6-4-6 4z" negrita="Guardá" resto="tus libros en tu Marcapáginas." />
          <GateColumn color="#5EB1BF" glyph={SHELF_PATH} negrita="Armá tu estantería" resto="y comprá." />
          <GateColumn color="#CDEDF6" glyph="M21 12a8 8 0 01-11.5 7.2L4 20l1-4.5A8 8 0 1121 12z" negrita="Opiná y puntuá" resto="lo que leíste." />
        </div>
        <div className="modal-btns">
          <button className="btn alt" type="button" onClick={() => ir('/ingresar')}>Ya tengo cuenta</button>
          <button className="btn main" type="button" onClick={() => ir('/registrarse')}>Crear cuenta</button>
        </div>
      </div>
    </div>
  )
}

export default LoginGate
