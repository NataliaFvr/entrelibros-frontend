// Texto de "Sobre nosotros". Las palabras destacadas toman los colores de la paleta.
const Color = ({ c, children }) => <b style={{ color: `var(--${c})` }}>{children}</b>

const AboutStory = () => {
  return (
    <div className="card about-txt">
      <p>
        ¡Hola! Somos Nati, Facu, Valen, Lu y Thiago, cinco lectores empedernidos que un día decidieron convertir su <Color c="burnt">obsesión</Color> en Entrelibros.
      </p>
      <p>
        Todo empezó como suelen empezar estas cosas: charlas eternas sobre finales que nos rompieron el corazón, <Color c="blue">pilas de libros</Color> creciendo en cada rincón de casa y ese ritual insustituible de abrir una página nueva. Ahí entendimos que un libro nunca es solo papel: es una <Color c="tangerine">puerta</Color>, un <Color c="tangerine">refugio</Color>, una conversación que sigue viva mucho después del último capítulo.
      </p>
      <p>
        Por eso en Entrelibros conviven las <Color c="blue">últimas novedades</Color> recién salidas de imprenta con esos <Color c="burnt">tesoros usados</Color> que ya vivieron una historia propia y están listos para la próxima. Cada libro con marcas, dedicatorias o el lomo un poco gastado tiene algo para contar, y nos encanta imaginar que sigue viajando de mano en mano.
      </p>
      <p>
        Detrás de cada pedido que armamos hay tiempo, <Color c="evergreen">café</Color> y mucho <Color c="burnt">cariño</Color>: elegimos, revisamos y seleccionamos cada título para que encuentres justo esa lectura que estabas buscando, aunque todavía no lo supieras.
      </p>
      <p>Gracias por sumarte a este rincón lector. ¡Bienvenido a Entrelibros!</p>
    </div>
  )
}

export default AboutStory
