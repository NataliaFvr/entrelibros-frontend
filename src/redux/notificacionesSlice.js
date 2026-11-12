import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  cantidadNoLeidasApi, eliminarNotificacionApi, listarPrimeraPaginaNotificacionesApi, marcarLeidaApi, marcarTodasLeidasApi,
} from "../api/cuentaApi";

// Las 20 más nuevas y la cantidad de no leídas. `idUsuario` = de qué cuenta son.
export const fetchNotificaciones = createAsyncThunk(
  "notificaciones/fetchnotificaciones",
  async () => {
    const [items, noLeidas] = await Promise.all([listarPrimeraPaginaNotificacionesApi(), cantidadNoLeidasApi()]);
    return { items, noLeidas };
  },
  { condition: (_, { getState }) => !getState().notificaciones.loading },
);

export const marcarLeida = createAsyncThunk("notificaciones/marcarleida", async (id) => marcarLeidaApi(id));

export const descartarNotificacion = createAsyncThunk("notificaciones/descartarnotificacion", async (id) => {
  await eliminarNotificacionApi(id);
  return id;
});

export const marcarTodasLeidas = createAsyncThunk("notificaciones/marcartodasleidas", async () => marcarTodasLeidasApi());

const notificacionesSlice = createSlice({
  name: "notificaciones",
  initialState: {
    idUsuario: null,
    items: [],
    noLeidas: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificaciones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificaciones.fulfilled, (state, action) => {
        state.loading = false;
        state.idUsuario = action.meta.arg;
        state.items = action.payload.items;
        state.noLeidas = action.payload.noLeidas;
      })
      .addCase(fetchNotificaciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(marcarLeida.fulfilled, (state, action) => {
        const index = state.items.findIndex((n) => n.id === action.meta.arg);
        if (index === -1) return;
        if (!state.items[index].leida) state.noLeidas = Math.max(0, state.noLeidas - 1);
        state.items[index] = action.payload;
      })
      .addCase(descartarNotificacion.fulfilled, (state, action) => {
        const notificacion = state.items.find((n) => n.id === action.payload);
        if (notificacion && !notificacion.leida) state.noLeidas = Math.max(0, state.noLeidas - 1);
        state.items = state.items.filter((n) => n.id !== action.payload);
      })
      .addCase(marcarTodasLeidas.fulfilled, (state) => {
        state.items.forEach((n) => {
          n.leida = true;
        });
        state.noLeidas = 0;
      });
  },
});

export default notificacionesSlice.reducer;
