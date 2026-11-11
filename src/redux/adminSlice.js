import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { cargarOrdenes, cargarPagos } from "../api/adminApi";

export const fetchOrdenesAdmin = createAsyncThunk("admin/fetchordenesadmin", async () => cargarOrdenes(), {
  condition: (_, { getState }) => !getState().admin.cargandoOrdenes,
});

export const fetchPagosAdmin = createAsyncThunk("admin/fetchpagosadmin", async () => cargarPagos(), {
  condition: (_, { getState }) => !getState().admin.cargandoPagos,
});

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    ordenes: [],
    ordenesCargadas: false,
    cargandoOrdenes: false,
    pagos: [],
    pagosCargados: false,
    cargandoPagos: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdenesAdmin.pending, (state) => {
        state.cargandoOrdenes = true;
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
