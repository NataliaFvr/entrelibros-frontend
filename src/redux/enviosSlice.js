import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { actualizarTarifaEnvioApi, crearTarifaEnvioApi, listarTarifasEnvioApi } from "../api/enviosApi";

// Tarifas: { misma: 1800, distinta: 3500, ids: { misma: 1, distinta: 2 } }
export const fetchTarifas = createAsyncThunk("envios/fetchtarifas", async () => listarTarifasEnvioApi(), {
  condition: (_, { getState }) => !getState().envios.cargando,
});

export const actualizarTarifa = createAsyncThunk("envios/actualizartarifa", async ({ zona, costo }, { getState }) =>
  actualizarTarifaEnvioApi(getState().envios.tarifas.ids[zona], costo));

export const crearTarifa = createAsyncThunk("envios/creartarifa", async ({ zona, costo }) => crearTarifaEnvioApi(zona, costo));

// La respuesta { id, zona, costoFijo } actualiza el estado sin volver a pedir la lista
const aplicar = (state, action) => {
  const { id, zona, costoFijo } = action.payload;
  state.tarifas[zona] = costoFijo;
  state.tarifas.ids = { ...state.tarifas.ids, [zona]: id };
};

const enviosSlice = createSlice({
  name: "envios",
  initialState: {
    tarifas: { ids: {} },
    cargada: false,
    cargando: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTarifas.pending, (state) => {
        state.cargando = true;
      })
      .addCase(fetchTarifas.fulfilled, (state, action) => {
        state.cargando = false;
        state.tarifas = action.payload;
        state.cargada = true;
      })
      .addCase(fetchTarifas.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message;
      })
      .addCase(actualizarTarifa.fulfilled, aplicar)
      .addCase(crearTarifa.fulfilled, aplicar);
  },
});

export default enviosSlice.reducer;
