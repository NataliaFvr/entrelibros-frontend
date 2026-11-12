import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getVendedorPublicoApi } from "../api/vendedoresApi";

// Perfil público de un vendedor (GET /vendedores/{id}): null si no existe
export const fetchVendedorPublico = createAsyncThunk("vendedores/fetchvendedorpublico", async (id) => getVendedorPublicoApi(id));

const vendedoresSlice = createSlice({
  name: "vendedores",
  initialState: {
    publicos: {}, // id -> datos del perfil (o null)
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendedorPublico.fulfilled, (state, action) => {
        state.publicos[action.meta.arg] = action.payload;
      })
      .addCase(fetchVendedorPublico.rejected, (state, action) => {
        state.publicos[action.meta.arg] = null;
      });
  },
});

export default vendedoresSlice.reducer;
