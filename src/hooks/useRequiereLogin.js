import { useToast } from './useToast'


export default function useRequiereLogin() {
  const toast = useToast()
  return () => {
    toast('Iniciá sesión para continuar')
    return true
  }
}
