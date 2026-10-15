export function mostrarError(mensaje: string): void {
  console.error(`Error: ${mensaje}`);
}

export function fallar(mensaje: string): never {
  mostrarError(mensaje);
  process.exit(1);
}

export function manejarError(error: unknown): never {
  if (error instanceof Error) {
    fallar(error.message);
  }
  fallar('Ha ocurrido un error inesperado.');
}
