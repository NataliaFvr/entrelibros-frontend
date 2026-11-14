import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./adminSlice";
import carritoReducer from "./carritoSlice";
import contactoReducer from "./contactoSlice";
import enviosReducer from "./enviosSlice";
import librosReducer from "./librosSlice";
import moderacionReducer from "./moderacionSlice";
import notificacionesReducer from "./notificacionesSlice";
import pedidosReducer from "./pedidosSlice";
import resenasReducer from "./resenasSlice";
import toastReducer from "./toastSlice";
import userReducer from "./userSlice";
import vendedorReducer from "./vendedorSlice";
import vendedoresReducer from "./vendedoresSlice";
import ventasReducer from "./ventasSlice";

export const store = configureStore({
  reducer: {
    toast: toastReducer,
    user: userReducer,
    libros: librosReducer,
    carrito: carritoReducer,
    contacto: contactoReducer,
    pedidos: pedidosReducer,
    vendedor: vendedorReducer,
    ventas: ventasReducer,
    moderacion: moderacionReducer,
    envios: enviosReducer,
    admin: adminReducer,
    resenas: resenasReducer,
    notificaciones: notificacionesReducer,
    vendedores: vendedoresReducer,
  },
});
