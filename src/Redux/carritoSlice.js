import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { agregarItemApi, cambiarCantidadItemApi, listarCarritoApi, quitarItemApi } from "../api/carritoApi";
import { mensajeError } from "../utils/errorApi";

// Cada thunk hace su pedido al back y devuelve el carrito que queda: [{ id: idLibro, q: cantidad, idItem, maxCantidad }]
export const fetchCarrito = createAsyncThunk("carrito/fetchcarrito", async (idUsuario) => {
  if (idUsuario == null) return []; // sin sesión (o admin): carrito vacío
  try {
    return await listarCarritoApi();
  } catch (err) {
    throw new Error(mensajeError(err));
  }
});

export const agregarAlCarrito = createAsyncThunk("carrito/agregaralcarrito", async ({ libro, cantidad }) => {
  try {
    const actual = (await listarCarritoApi()).find((c) => c.id === libro.id);
    if (actual) await cambiarCantidadItemApi(actual.idItem, Math.min(actual.q + cantidad, actual.maxCantidad));
    else await agregarItemApi(libro.id, cantidad); // POST siempre crea una fila nueva: solo si el libro no estaba
    return await listarCarritoApi();
  } catch (err) {
    throw new Error(mensajeError(err));
  }
});

export const cambiarCantidad = createAsyncThunk("carrito/cambiarcantidad", async ({ libro, delta }) => {
  try {
    const actual = (await listarCarritoApi()).find((c) => c.id === libro.id);
    if (actual) await cambiarCantidadItemApi(actual.idItem, actual.q + delta);
    return await listarCarritoApi();
  } catch (err) {
    throw new Error(mensajeError(err));
  }
});

export const quitarDelCarrito = createAsyncThunk("carrito/quitardelcarrito", async (id) => {
  try {
    const actual = (await listarCarritoApi()).find((c) => c.id === id);
    if (actual) await quitarItemApi(actual.idItem);
    return await listarCarritoApi();
  } catch (err) {
    throw new Error(mensajeError(err));
  }
});

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
        (state.loading = true), (state.error = null);
      })
      .addCase(fetchCarrito.fulfilled, (state, action) => {
        (state.loading = false), (state.items = action.payload);
      })
      .addCase(fetchCarrito.rejected, (state, action) => {
        (state.loading = false), (state.error = action.error.message);
      })
      .addCase(agregarAlCarrito.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(agregarAlCarrito.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(cambiarCantidad.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(cambiarCantidad.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(quitarDelCarrito.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(quitarDelCarrito.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default carritoSlice.reducer;