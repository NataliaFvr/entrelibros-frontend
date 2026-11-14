/* oxlint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Aviso breve: { id, msg, accion?: { texto, a } }. `accion` es un link opcional dentro del aviso (ej. "Ir a mi estantería").
// El thunk espera el tiempo que dura el aviso y, al terminar, el slice lo cierra (solo si sigue siendo el mismo aviso).
export const mostrarToast = createAsyncThunk("toast/mostrarToast", async ({ accion }) => {
  await new Promise((resolver) => setTimeout(resolver, accion ? 4000 : 2400));
});

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    aviso: null,
  },
  reducers: {
    cerrarToast: (state) => {
      state.aviso = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(mostrarToast.pending, (state, action) => {
        state.aviso = { id: action.meta.requestId, msg: action.meta.arg.msg, accion: action.meta.arg.accion };
      })
      .addCase(mostrarToast.fulfilled, (state, action) => {
        if (state.aviso && state.aviso.id === action.meta.requestId) state.aviso = null;
      });
  },
});

export const { cerrarToast } = toastSlice.actions;

export default toastSlice.reducer;