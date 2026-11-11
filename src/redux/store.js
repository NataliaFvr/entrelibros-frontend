import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./adminSlice";
import authReducer from "./authSlice";
import carritoReducer from "./carritoSlice";
import categoriasReducer from "./categoriasSlice";
import enviosReducer from "./enviosSlice";
import librosReducer from "./librosSlice";
import moderacionReducer from "./moderacionSlice";
import pedidosReducer from "./pedidosSlice";
import resenasReducer from "./resenasSlice";
import toastReducer from "./toastSlice";
import usuariosReducer from "./usuariosSlice";
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
    usuarios: usuariosReducer,
    moderacion: moderacionReducer,
    envios: enviosReducer,
    admin: adminReducer,
    resenas: resenasReducer,
  },
});
