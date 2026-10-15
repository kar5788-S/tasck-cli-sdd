import type { Command } from 'commander';
import { createConnection } from '../db/connection.js';
import { insertTask } from '../db/tasks.js';
import { normalizarPrioridad, validarTitulo } from '../utils/tasks.js';
import { manejarError } from '../utils/errors.js';

export function registerAdd(program: Command): void {
  program
    .command('add <title>')
    .description('Crea una nueva tarea')
    .option('--priority <priority>', 'Prioridad: high, medium, low')
    .option('--description <description>', 'Descripción de la tarea')
    .action((title: string, options: { priority?: string; description?: string }) => {
      try {
        const tituloValido = validarTitulo(title);
        const prioridad = options.priority !== undefined ? normalizarPrioridad(options.priority) : undefined;
        const db = createConnection();
        try {
          const tarea = insertTask(db, { title: tituloValido, description: options.description ?? null, priority: prioridad });
          console.log(`Tarea ${tarea.id} creada (${tarea.status}, ${tarea.priority})`);
        } finally {
          db.close();
        }
      } catch (error) {
        manejarError(error);
      }
    });
}
