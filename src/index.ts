#!/usr/bin/env -S npx tsx
import { Command } from 'commander';
import { registerAdd } from './commands/add.js';
import { registerList } from './commands/list.js';
import { registerStatus } from './commands/status.js';
import { registerUpdate } from './commands/update.js';
import { registerDelete } from './commands/delete.js';

const program = new Command();

program
  .name('task-cli')
  .description('CLI para gestión de tareas personales')
  .version('1.0.0');

registerAdd(program);
registerList(program);
registerStatus(program);
registerUpdate(program);
registerDelete(program);

program.parse(process.argv);
