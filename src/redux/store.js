import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import carritoReducer from "./carritoSlice";
import categoriasReducer from "./categoriasSlice";
import librosReducer from "./librosSlice";
import pedidosReducer from "./pedidosSlice";
import toastReducer from "./toastSlice";
import vendedorReducer from "./vendedorSlice";
import ventasReducer from "./ventasSlice";

export const store = configureStore({
  reducer: {
    toast: toastReducer,
    auth: authReducer,
    libros: librosReducer,
    categorias: categoriasReducer,
    carrito: carritoReducer,
    pedidos: pedidosReducer,
    vendedor: vendedorReducer,
    ventas: ventasReducer,
  },
});