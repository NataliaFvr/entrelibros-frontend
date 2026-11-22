import { Component } from 'react'

// Última línea de defensa ante errores de renderizado: evita dejar una página
// blanca y permite intentar montar el árbol de nuevo sin recargar manualmente.
class ErrorBoundary extends Component {
  state = { error: false }

  static getDerivedStateFromError() {
    return { error: true }
  }

  reintentar = () => {
    this.setState({ error: false })
  }

  render() {
    if (this.state.error) {
      return (
        <main className="error-boundary" role="alert">
          <section className="error-boundary-card">
            <span aria-hidden="true">⚠</span>
            <h1 className="fr">No pudimos mostrar esta página</h1>
            <p>Ocurrió un problema inesperado. Podés intentarlo de nuevo.</p>
            <button className="btn main" type="button" onClick={this.reintentar}>Reintentar</button>
            <a className="btn" href="/">Volver al inicio</a>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary