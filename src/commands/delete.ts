import type { Command } from 'commander';
import readline from 'node:readline';
import { createConnection } from '../db/connection.js';
import { deleteTask, getTaskById } from '../db/tasks.js';
import { manejarError } from '../utils/errors.js';

function preguntarConfirmacion(pregunta: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(pregunta, (respuesta) => {
      rl.close();
      resolve(respuesta.trim().toLowerCase());
    });
  });
}

export function registerDelete(program: Command): void {
  program
    .command('delete <id>')
    .description('Elimina una tarea')
    .option('--force', 'Eliminar sin pedir confirmación')
    .action(async (idArg: string, options: { force?: boolean }) => {
      try {
        const id = Number(idArg);
        if (!Number.isInteger(id) || id <= 0) {
          throw new Error(`ID inválido: ${idArg}. Debe ser un número entero positivo.`);
        }
        const db = createConnection();
        try {
          const tarea = getTaskById(db, id);
          if (!tarea) {
            throw new Error(`No existe la tarea con ID ${id}.`);
          }
          if (!options.force) {
            const respuesta = await preguntarConfirmacion(`¿Eliminar la tarea ${id} "${tarea.title}"? (s/y para confirmar): `);
            if (respuesta !== 's' && respuesta !== 'y') {
              console.log('Eliminación cancelada');
              return;
            }
          }
          deleteTask(db, id);
          console.log(`Tarea ${id} eliminada`);
        } finally {
          db.close();
        }
      } catch (error) {
        manejarError(error);
      }
    });
}
