import { useContext } from 'react'
import { ToastCtx } from '../context/toastCtx'

export const useToast = () => useContext(ToastCtx)
