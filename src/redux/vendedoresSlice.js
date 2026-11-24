import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getVendedorPublicoApi } from "../api/vendedoresApi";

// Perfil público de un vendedor (GET /vendedores/{id}): null si no existe
export const fetchVendedorPublico = createAsyncThunk("vendedores/fetchVendedorPublico", async (id) => getVendedorPublicoApi(id), {
  condition: (id, { getState }) => {
    const { publicos, solicitudes } = getState().vendedores;
    return publicos[id] === undefined && !solicitudes[id];
  },
});

const vendedoresSlice = createSlice({
  name: "vendedores",
  initialState: {
    publicos: {}, // id -> datos del perfil (o null)
    solicitudes: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendedorPublico.pending, (state, action) => {
        state.solicitudes[action.meta.arg] = true;
      })
      .addCase(fetchVendedorPublico.fulfilled, (state, action) => {
        delete state.solicitudes[action.meta.arg];
        state.publicos[action.meta.arg] = action.payload;
      })
      .addCase(fetchVendedorPublico.rejected, (state, action) => {
        delete state.solicitudes[action.meta.arg];
        state.publicos[action.meta.arg] = null;
      });
  },
});

export default vendedoresSlice.reducer;
