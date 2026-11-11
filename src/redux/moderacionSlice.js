import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { aLibroFront } from "../api/adaptadores";
import { fuenteModeracion } from "../api/moderacionApi";

export const fetchSolicitudes = createAsyncThunk("moderacion/fetchsolicitudes", async () => fuenteModeracion.obtenerSolicitudes(), {
  condition: (_, { getState }) => !getState().moderacion.loading,
});

// `accion` = { aprobado: true } o { aprobado: false, motivoRechazo }. Devuelve el libro como quedó.
export const moderar = createAsyncThunk("moderacion/moderar", async ({ id, accion }) =>
  aLibroFront(await fuenteModeracion.moderarSolicitud(id, accion)));

const moderacionSlice = createSlice({
  name: "moderacion",
  initialState: {
    items: [],
    cargadas: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolicitudes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSolicitudes.fulfilled, (state, action) => {
        state.loading = false;
        state.cargadas = true;
        state.items = action.payload;
      })
      .addCase(fetchSolicitudes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(moderar.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s.id !== action.meta.arg.id);
      });
  },
});

export default moderacionSlice.reducer;
