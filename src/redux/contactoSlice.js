import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { enviarContactoApi } from "../api/cuentaApi";
import { conDetalle } from "./conDetalle";

export const enviarContacto = createAsyncThunk(
  "contacto/enviarContacto",
  async (contacto) => enviarContactoApi(contacto),
  conDetalle,
);

const contactoSlice = createSlice({
  name: "contacto",
  initialState: {
    enviando: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(enviarContacto.pending, (state) => {
        state.enviando = true;
        state.error = null;
      })
      .addCase(enviarContacto.fulfilled, (state) => {
        state.enviando = false;
      })
      .addCase(enviarContacto.rejected, (state, action) => {
        state.enviando = false;
        state.error = action.error.message;
      });
  },
});

export default contactoSlice.reducer;
