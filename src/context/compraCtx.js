import { createContext } from 'react'

export const CompraCtx = createContext({
  carrito: [], pedidos: [], cartCount: 0, compro: () => false,
  agregar: () => {}, cambiarCantidad: () => {}, quitar: () => {},
  crearPedido: () => '', pagarPedido: () => {}, cancelarPedido: () => {},
})
