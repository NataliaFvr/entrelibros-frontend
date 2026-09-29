import { useContext } from 'react'
import { AuthCtx } from '../context/authCtx'

export const useAuth = () => useContext(AuthCtx)
