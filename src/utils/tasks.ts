export const PRIORIDADES = ['high', 'medium', 'low'] as const;
export const ESTADOS = ['todo', 'in-progress', 'done'] as const;

export type Prioridad = (typeof PRIORIDADES)[number];
export type Estado = (typeof ESTADOS)[number];

export function validarTitulo(titulo: unknown): string {
  if (typeof titulo !== 'string' || titulo.trim().length === 0) {
    throw new Error('El título es obligatorio y no puede estar vacío.');
  }
  return titulo.trim();
}

export function normalizarPrioridad(valor: unknown): Prioridad {
  const v = typeof valor === 'string' ? valor.trim().toLowerCase() : '';
  if ((PRIORIDADES as readonly string[]).includes(v)) {
    return v as Prioridad;
  }
  throw new Error(`Prioridad inválida: ${String(valor)}. Valores válidos: ${PRIORIDADES.join(', ')}.`);
}

export function normalizarEstado(valor: unknown): Estado {
  const v = typeof valor === 'string' ? valor.trim().toLowerCase() : '';
  if ((ESTADOS as readonly string[]).includes(v)) {
    return v as Estado;
  }
  throw new Error(`Estado inválido: ${String(valor)}. Valores válidos: ${ESTADOS.join(', ')}.`);
}

const TRANSICIONES_VALIDAS: Record<Estado, Estado[]> = {
  todo: ['in-progress'],
  'in-progress': ['done', 'todo'],
  done: ['todo'],
};

export function esTransicionValida(actual: Estado, nuevo: Estado): boolean {
  return TRANSICIONES_VALIDAS[actual]?.includes(nuevo) ?? false;
}
