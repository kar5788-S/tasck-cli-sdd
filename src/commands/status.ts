import type { Command } from 'commander';
import { createConnection } from '../db/connection.js';
import { getTaskById, updateTaskStatus } from '../db/tasks.js';
import { esTransicionValida, normalizarEstado } from '../utils/tasks.js';
import { manejarError } from '../utils/errors.js';

export function registerStatus(program: Command): void {
  program
    .command('status <id> <nuevoEstado>')
    .description('Cambia el estado de una tarea')
    .action((idArg: string, nuevoEstadoArg: string) => {
      try {
        const id = Number(idArg);
        if (!Number.isInteger(id) || id <= 0) {
          throw new Error(`ID inválido: ${idArg}. Debe ser un número entero positivo.`);
        }
        const nuevoEstado = normalizarEstado(nuevoEstadoArg);
        const db = createConnection();
        try {
          const tarea = getTaskById(db, id);
          if (!tarea) {
            throw new Error(`No existe la tarea con ID ${id}.`);
          }
          if (!esTransicionValida(tarea.status, nuevoEstado)) {
            throw new Error(`Transición inválida: ${tarea.status} → ${nuevoEstado}.`);
          }
          const actualizada = updateTaskStatus(db, id, nuevoEstado);
          console.log(`Tarea ${id} actualizada a ${actualizada!.status}`);
        } finally {
          db.close();
        }
      } catch (error) {
        manejarError(error);
      }
    });
}
