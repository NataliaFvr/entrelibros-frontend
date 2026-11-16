import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logout } from "./userSlice";
import { cargarOrdenes, cargarPagos } from "../api/adminApi";

export const fetchOrdenesAdmin = createAsyncThunk("admin/fetchOrdenesAdmin", async () => cargarOrdenes(), {
  condition: (_, { getState }) => !getState().admin.cargandoOrdenes,
});

export const fetchPagosAdmin = createAsyncThunk("admin/fetchPagosAdmin", async () => cargarPagos(), {
  condition: (_, { getState }) => !getState().admin.cargandoPagos,
});

const initialState = {
  ordenes: [],
  ordenesCargadas: false,
  cargandoOrdenes: false,
  pagos: [],
  pagosCargados: false,
  cargandoPagos: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Datos del panel del admin: al cerrar sesión se vacían para que no queden para la próxima cuenta
      .addCase(logout.fulfilled, () => initialState)
      .addCase(fetchOrdenesAdmin.pending, (state) => {
        state.cargandoOrdenes = true;
        state.error = null;
      })
      .addCase(fetchOrdenesAdmin.fulfilled, (state, action) => {
        state.cargandoOrdenes = false;
        state.ordenes = action.payload;
        state.ordenesCargadas = true;
      })
      .addCase(fetchOrdenesAdmin.rejected, (state, action) => {
        state.cargandoOrdenes = false;
        state.error = action.error.message;
      })
      .addCase(fetchPagosAdmin.pending, (state) => {
        state.cargandoPagos = true;
        state.error = null;
      })
      .addCase(fetchPagosAdmin.fulfilled, (state, action) => {
        state.cargandoPagos = false;
        state.pagos = action.payload;
        state.pagosCargados = true;
      })
      .addCase(fetchPagosAdmin.rejected, (state, action) => {
        state.cargandoPagos = false;
        state.error = action.error.message;
      });
  },
});

export default adminSlice.reducer;