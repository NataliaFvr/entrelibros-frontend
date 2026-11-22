import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from "redux-persist";
import storageModule from "redux-persist/lib/storage";
import { configurarAlmacenTokens } from "../api/axiosConfig";
import adminReducer from "./adminSlice";
import cargoServicioReducer from "./cargoServicioSlice";
import carritoReducer from "./carritoSlice";
import contactoReducer from "./contactoSlice";
import enviosReducer from "./enviosSlice";
import librosReducer from "./librosSlice";
import moderacionReducer from "./moderacionSlice";
import notificacionesReducer from "./notificacionesSlice";
import pedidosReducer from "./pedidosSlice";
import resenasReducer from "./resenasSlice";
import toastReducer from "./toastSlice";
import userReducer, { establecerTokens, limpiarTokens } from "./userSlice";
import vendedorReducer from "./vendedorSlice";
import vendedoresReducer from "./vendedoresSlice";
import ventasReducer from "./ventasSlice";
// El paquete se distribuye como CommonJS; Vite puede envolver el adaptador en
// `default`. Normalizamos ambas formas antes de dárselo a redux-persist.
const storage = typeof storageModule.getItem === "function" ? storageModule : storageModule.default;

// Solo se conserva la sesión (usuario y tokens) del slice `user`.
// Marcapáginas, direcciones, catálogo, fotos, modales y estados de carga siempre
// arrancan limpios y se vuelven a pedir al abrir la app.
const userPersistConfig = {
  key: "entrelibros-user", // clave nueva: no rehidrata la copia anterior que guardaba todo el slice
  storage,
  whitelist: ["user", "tokens"],
};

const rootReducer = combineReducers({
  toast: toastReducer,
  user: persistReducer(userPersistConfig, userReducer),
  libros: librosReducer,
  carrito: carritoReducer,
  contacto: contactoReducer,
  pedidos: pedidosReducer,
  vendedor: vendedorReducer,
  ventas: ventasReducer,
  moderacion: moderacionReducer,
  envios: enviosReducer,
  cargoServicio: cargoServicioReducer,
  admin: adminReducer,
  resenas: resenasReducer,
  notificaciones: notificacionesReducer,
  vendedores: vendedoresReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  // Al publicar/editar se envían fotos temporales en base64 dentro de acciones.
  // Conservamos los controles de desarrollo, pero les damos margen antes de advertir.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: { warnAfter: 128 },
    serializableCheck: {
      warnAfter: 128,
      // Las acciones internas de redux-persist llevan funciones de control.
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

configurarAlmacenTokens({
  leer: () => store.getState().user.tokens,
  guardar: (tokens) => store.dispatch(establecerTokens(tokens)),
  borrar: () => store.dispatch(limpiarTokens()),
});

export const persistor = persistStore(store);
