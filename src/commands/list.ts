import type { Command } from 'commander';
import { createConnection } from '../db/connection.js';
import { listTasks } from '../db/tasks.js';
import { normalizarEstado, normalizarPrioridad } from '../utils/tasks.js';
import { formatearTabla } from '../utils/format.js';
import { manejarError } from '../utils/errors.js';

export function registerList(program: Command): void {
  program
    .command('list')
    .description('Lista las tareas')
    .option('--status <status>', 'Filtrar por estado: todo, in-progress, done')
    .option('--priority <priority>', 'Filtrar por prioridad: high, medium, low')
    .action((options: { status?: string; priority?: string }) => {
      try {
        const status = options.status !== undefined ? normalizarEstado(options.status) : undefined;
        const priority = options.priority !== undefined ? normalizarPrioridad(options.priority) : undefined;
        const db = createConnection();
        try {
          const tareas = listTasks(db, { status, priority });
          if (tareas.length === 0) {
            console.log('No hay tareas');
          } else {
            console.log(formatearTabla(tareas));
          }
        } finally {
          db.close();
        }
      } catch (error) {
        manejarError(error);
      }
    });
}
