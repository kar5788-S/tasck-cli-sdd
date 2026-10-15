import Table from 'cli-table3';
import type { Task } from '../db/tasks.js';

const COLOR_ESTADO: Record<string, string> = {
  todo: '\x1b[33m',
  'in-progress': '\x1b[34m',
  done: '\x1b[32m',
};

const COLOR_PRIORIDAD: Record<string, string> = {
  high: '\x1b[31m',
  medium: '\x1b[33m',
  low: '\x1b[36m',
};

const RESET = '\x1b[0m';

function colorear(texto: string, color: string | undefined): string {
  return color ? `${color}${texto}${RESET}` : texto;
}

export function formatearFecha(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function formatearTabla(tareas: Task[]): string {
  const tabla = new Table({
    head: ['ID', 'Título', 'Estado', 'Prioridad', 'Creada'],
  });
  for (const t of tareas) {
    tabla.push([
      t.id,
      t.title,
      colorear(t.status, COLOR_ESTADO[t.status]),
      colorear(t.priority, COLOR_PRIORIDAD[t.priority]),
      formatearFecha(t.created_at),
    ]);
  }
  return tabla.toString();
}
