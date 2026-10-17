import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ToastCtx } from './toastCtx'

const ToastProvider = ({ children }) => {
  const [aviso, setAviso] = useState(null) // { msg, accion?: { texto, a } }
  const timer = useRef(null)

  // `accion` es opcional: un link dentro del aviso (ej. "Ir a mi estantería" después de añadir un libro)
  const toast = useCallback((msg, accion) => {
    setAviso({ msg, accion })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setAviso(null), accion ? 4000 : 2400)
  }, [])

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="toast" role="status" hidden={!aviso}>
        {aviso?.msg}
        {aviso?.accion && (
          <Link className="toast-a" to={aviso.accion.a} onClick={() => setAviso(null)}>{aviso.accion.texto}</Link>
        )}
      </div>
    </ToastCtx.Provider>
  )
}

export default ToastProvider
