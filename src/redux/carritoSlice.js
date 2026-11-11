import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { agregarItemApi, cambiarCantidadItemApi, listarCarritoApi, quitarItemApi } from "../api/carritoApi";
import { crearPedido } from "./pedidosSlice";

// Carrito: [{ id: idLibro, q: cantidad, idItem, maxCantidad }]. fetchCarrito lo lee entero; las demás acciones devuelven solo el ítem que cambió.
// Los errores llegan con el mensaje claro desde api/axiosConfig.js: si una llamada falla, el `rejected` lo despacha createAsyncThunk.
export const fetchCarrito = createAsyncThunk("carrito/fetchcarrito", async (idUsuario) => {
  if (idUsuario == null) return []; // sin sesión (o admin): carrito vacío
  return listarCarritoApi();
});

export const agregarAlCarrito = createAsyncThunk("carrito/agregaralcarrito", async ({ libro, cantidad }, { getState }) => {
  const actual = getState().carrito.items.find((c) => c.id === libro.id);
  if (actual) return cambiarCantidadItemApi(actual.idItem, Math.min(actual.q + cantidad, actual.maxCantidad));
  return agregarItemApi(libro.id, cantidad); // POST siempre crea una fila nueva: solo si el libro no estaba
});

export const cambiarCantidad = createAsyncThunk("carrito/cambiarcantidad", async ({ libro, delta }, { getState }) => {
  const actual = getState().carrito.items.find((c) => c.id === libro.id);
  if (!actual) return null;
  return cambiarCantidadItemApi(actual.idItem, actual.q + delta);
});

export const quitarDelCarrito = createAsyncThunk("carrito/quitardelcarrito", async (id, { getState }) => {
  const actual = getState().carrito.items.find((c) => c.id === id);
  if (actual) await quitarItemApi(actual.idItem);
  return id;
});

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
      })
      .addCase(fetchCarrito.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(agregarAlCarrito.fulfilled, (state, action) => {
        guardarItem(state, action.payload);
      })
      .addCase(agregarAlCarrito.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(cambiarCantidad.fulfilled, (state, action) => {
        guardarItem(state, action.payload);
      })
      .addCase(cambiarCantidad.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(quitarDelCarrito.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      })
      .addCase(quitarDelCarrito.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // El checkout convierte el carrito en una orden: el back ya lo vació, acá se vacía sin volver a pedirlo
      .addCase(crearPedido.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default carritoSlice.reducer;