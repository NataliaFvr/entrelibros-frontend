import { configureStore } from "@reduxjs/toolkit";
import carritoReducer from "./carritoSlice";
import categoriasReducer from "./categoriasSlice";
import librosReducer from "./librosSlice";
import pedidosReducer from "./pedidosSlice";

export const store = configureStore({
  reducer: {
    libros: librosReducer,
    categorias: categoriasReducer,
    carrito: carritoReducer,
    pedidos: pedidosReducer,
  },
});