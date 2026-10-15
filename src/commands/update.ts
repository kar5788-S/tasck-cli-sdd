import type { Command } from 'commander';
import { createConnection } from '../db/connection.js';
import { getTaskById, updateTask } from '../db/tasks.js';
import { normalizarPrioridad, validarTitulo } from '../utils/tasks.js';
import { manejarError } from '../utils/errors.js';

export function registerUpdate(program: Command): void {
  program
    .command('update <id>')
    .description('Actualiza una tarea')
    .option('--title <title>', 'Nuevo título')
    .option('--description <description>', 'Nueva descripción')
    .option('--priority <priority>', 'Nueva prioridad: high, medium, low')
    .action((idArg: string, options: { title?: string; description?: string; priority?: string }) => {
      try {
        const id = Number(idArg);
        if (!Number.isInteger(id) || id <= 0) {
          throw new Error(`ID inválido: ${idArg}. Debe ser un número entero positivo.`);
        }
        if (options.title === undefined && options.description === undefined && options.priority === undefined) {
          throw new Error('Debes indicar al menos un campo a actualizar: --title, --description o --priority.');
        }
        const title = options.title !== undefined ? validarTitulo(options.title) : undefined;
        const priority = options.priority !== undefined ? normalizarPrioridad(options.priority) : undefined;
        const db = createConnection();
        try {
          const tarea = getTaskById(db, id);
          if (!tarea) {
            throw new Error(`No existe la tarea con ID ${id}.`);
          }
          updateTask(db, id, { title, description: options.description, priority });
          console.log(`Tarea ${id} actualizada`);
        } finally {
          db.close();
        }
      } catch (error) {
        manejarError(error);
      }
    });
}
