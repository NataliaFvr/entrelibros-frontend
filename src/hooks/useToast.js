import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { mostrarToast } from '../Redux/toastSlice'

// `accion` es opcional: un link dentro del aviso (ej. "Ir a mi estantería" después de añadir un libro)
export const useToast = () => {
  const dispatch = useDispatch()
  return useCallback((msg, accion) => { dispatch(mostrarToast({ msg, accion })) }, [dispatch])
}