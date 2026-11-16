import { createSlice, nanoid } from "@reduxjs/toolkit";

// Aviso breve: { id, msg, accion?: { texto, a } }. `accion` es un link opcional dentro del aviso (ej. "Ir a mi estantería").
// El slice solo guarda qué aviso se ve; el tiempo que dura lo maneja el componente Toast (un efecto con setTimeout).
const toastSlice = createSlice({
  name: "toast",
  initialState: {
    aviso: null,
  },
  reducers: {
    // dispatch(mostrarToast({ msg, accion })): cada aviso lleva un id nuevo, así un aviso repetido reinicia el tiempo
    mostrarToast: {
      reducer: (state, action) => {
        state.aviso = action.payload;
      },
      prepare: ({ msg, accion = null }) => ({ payload: { id: nanoid(), msg, accion } }),
    },
    // Con id cierra solo ese aviso (si ya se mostró otro, no lo toca); sin id cierra el que esté
    cerrarToast: (state, action) => {
      if (!action.payload || state.aviso?.id === action.payload) state.aviso = null;
    },
  },
});

export const { mostrarToast, cerrarToast } = toastSlice.actions;

export default toastSlice.reducer;