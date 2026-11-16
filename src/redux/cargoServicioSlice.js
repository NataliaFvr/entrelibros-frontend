import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { actualizarCargoServicioApi, obtenerCargoServicioApi } from "../api/cargoServicioApi";
import { conDetalle } from "./conDetalle";

// Cargo de servicio que configura el admin: { porcentaje: 5, fechaActualizacion }.
// Solo lo usa el panel de moderación; carrito y órdenes reciben el cargo ya calculado por el back.
export const fetchCargoServicio = createAsyncThunk("cargoServicio/fetchCargoServicio", async () => obtenerCargoServicioApi(), {
  condition: (_, { getState }) => !getState().cargoServicio.cargando,
});

// La respuesta del PATCH actualiza el estado sin volver a pedirlo. `conDetalle` conserva el error del campo `porcentaje`.
export const actualizarCargoServicio = createAsyncThunk(
  "cargoServicio/actualizarCargoServicio",
  async (porcentaje) => actualizarCargoServicioApi(porcentaje),
  conDetalle,
);

const aplicar = (state, action) => {
  state.porcentaje = action.payload.porcentaje ?? 0;
  state.fechaActualizacion = action.payload.fechaActualizacion || null;
};

const cargoServicioSlice = createSlice({
  name: "cargoServicio",
  initialState: {
    porcentaje: null,
    fechaActualizacion: null,
    cargado: false,
    cargando: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCargoServicio.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(fetchCargoServicio.fulfilled, (state, action) => {
        state.cargando = false;
        state.cargado = true;
        aplicar(state, action);
      })
      .addCase(fetchCargoServicio.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message;
      })
      .addCase(actualizarCargoServicio.fulfilled, (state, action) => {
        state.cargado = true;
        state.error = null;
        aplicar(state, action);
      });
  },
});

export default cargoServicioSlice.reducer;