import { useContext } from 'react'
import { LibrosCtx } from '../context/librosCtx'

export const useLibros = () => useContext(LibrosCtx)
