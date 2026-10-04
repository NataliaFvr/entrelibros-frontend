// Props para <input type="number"> que evitan escribir caracteres que el campo no admite.
// 'entero' (año, descuento, stock): sin signos, punto, coma ni notación científica.
// 'decimal' (precio): admite punto o coma, pero no signos ni notación científica.
const BLOQUEADAS = {
  entero: ['e', 'E', '+', '-', '.', ','],
  decimal: ['e', 'E', '+', '-'],
}

export const propsNumero = (tipo) => ({
  inputMode: tipo === 'entero' ? 'numeric' : 'decimal',
  onKeyDown: (e) => { if (BLOQUEADAS[tipo].includes(e.key)) e.preventDefault() },
  onWheel: (e) => e.currentTarget.blur(), // la rueda del mouse no debe cambiar el número sin querer
})
