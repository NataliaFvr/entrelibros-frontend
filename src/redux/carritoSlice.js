import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { agregarItemApi, cambiarCantidadItemApi, cotizarEnvioApi, listarCarritoApi, quitarItemApi } from "../api/carritoApi";
import { crearPedido } from "./pedidosSlice";

// Carrito: [{ id: idLibro, q: cantidad, idItem, maxCantidad }]. fetchCarrito lo lee entero; las demás acciones devuelven solo el ítem que cambió.
// Los errores llegan con el mensaje claro desde api/axiosConfig.js: si una llamada falla, el `rejected` lo despacha createAsyncThunk.
export const fetchCarrito = createAsyncThunk("carrito/fetchCarrito", async (idUsuario) => {
  if (idUsuario == null) return []; // sin sesión (o admin): carrito vacío
  return listarCarritoApi();
});

export const agregarAlCarrito = createAsyncThunk("carrito/agregarAlCarrito", async ({ libro, cantidad }, { getState }) => {
  const actual = getState().carrito.items.find((c) => c.id === libro.id);
  if (actual) return cambiarCantidadItemApi(actual.idItem, Math.min(actual.q + cantidad, actual.maxCantidad));
  return agregarItemApi(libro.id, cantidad); // POST siempre crea una fila nueva: solo si el libro no estaba
});

export const cambiarCantidad = createAsyncThunk("carrito/cambiarCantidad", async ({ libro, delta }, { getState }) => {
  const actual = getState().carrito.items.find((c) => c.id === libro.id);
  if (!actual) return null;
  return cambiarCantidadItemApi(actual.idItem, actual.q + delta);
});

export const quitarDelCarrito = createAsyncThunk("carrito/quitarDelCarrito", async (id, { getState }) => {
  const actual = getState().carrito.items.find((c) => c.id === id);
  if (actual) await quitarItemApi(actual.idItem);
  return id;
});

export const fetchCotizacion = createAsyncThunk(
  "carrito/fetchCotizacion",
  async ({ idDireccion }) => cotizarEnvioApi(idDireccion),
  {
    condition: ({ idDireccion, clave }, { getState }) => {
      const state = getState().carrito;
      const key = `${idDireccion}:${clave}`;
      return !state.pendientes[key] && !state.cotizaciones[key] && !state.errores[key];
    },
  },
);

// El back devuelve el ítem ya actualizado: se reemplaza en la lista (o se agrega si es nuevo)
const guardarItem = (state, item) => {
  if (!item) return;
  const i = state.items.findIndex((c) => c.id === item.id);
  if (i >= 0) state.items[i] = item;
  else state.items.push(item);
};

const carritoSlice = createSlice({
  name: "carrito",
  initialState: {
    items: [],
    cotizaciones: {},
    pendientes: {},
    errores: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarrito.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarrito.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.cotizaciones = {};
        state.pendientes = {};
        state.errores = {};
      })
      .addCase(fetchCarrito.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(agregarAlCarrito.fulfilled, (state, action) => {
        guardarItem(state, action.payload);
        state.cotizaciones = {};
        state.pendientes = {};
        state.errores = {};
      })
      .addCase(agregarAlCarrito.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(cambiarCantidad.fulfilled, (state, action) => {
        guardarItem(state, action.payload);
        state.cotizaciones = {};
        state.pendientes = {};
        state.errores = {};
      })
      .addCase(cambiarCantidad.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(quitarDelCarrito.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
        state.cotizaciones = {};
        state.pendientes = {};
        state.errores = {};
      })
      .addCase(quitarDelCarrito.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // El checkout convierte el carrito en una orden: el back ya lo vació, acá se vacía sin volver a pedirlo
      .addCase(crearPedido.fulfilled, (state) => {
        state.items = [];
        state.cotizaciones = {};
        state.pendientes = {};
        state.errores = {};
      })
      .addCase(fetchCotizacion.pending, (state, action) => {
        const { idDireccion, clave } = action.meta.arg;
        state.pendientes[`${idDireccion}:${clave}`] = true;
      })
      .addCase(fetchCotizacion.fulfilled, (state, action) => {
        const { idDireccion, clave } = action.meta.arg;
        const key = `${idDireccion}:${clave}`;
        state.cotizaciones[key] = action.payload;
        delete state.pendientes[key];
        delete state.errores[key];
      })
      .addCase(fetchCotizacion.rejected, (state, action) => {
        if (action.meta.condition) return;
        const { idDireccion, clave } = action.meta.arg;
        const key = `${idDireccion}:${clave}`;
        delete state.pendientes[key];
        state.errores[key] = action.error.message;
      });
  },
});

export default carritoSlice.reducer;