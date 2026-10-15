import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { Database } from 'better-sqlite3';
import { createConnection } from '../src/db/connection.js';
import { deleteTask, getTaskById, insertTask, listTasks, updateTask, updateTaskStatus } from '../src/db/tasks.js';

let tmpDir: string;
let db: Database;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'task-cli-test-'));
  db = createConnection(path.join(tmpDir, 'tasks.db'));
});

afterEach(() => {
  db.close();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('insertTask', () => {
  it('crea tarea con defaults', () => {
    const t = insertTask(db, { title: 'Comprar leche' });
    expect(t.id).toBe(1);
    expect(t.priority).toBe('medium');
    expect(t.status).toBe('todo');
  });

  it('asigna IDs incrementales y no reutiliza', () => {
    const t1 = insertTask(db, { title: 'A' });
    const t2 = insertTask(db, { title: 'B' });
    deleteTask(db, t2.id);
    const t3 = insertTask(db, { title: 'C' });
    expect(t3.id).toBeGreaterThan(t2.id);
    expect(t1.id).toBe(1);
  });
});

describe('listTasks', () => {
  it('filtra por estado y prioridad y ordena por fecha desc', () => {
    insertTask(db, { title: 'Una', priority: 'high' });
    insertTask(db, { title: 'Dos', priority: 'low' });
    const todas = listTasks(db);
    expect(todas).toHaveLength(2);
    expect(todas[0].title).toBe('Dos');
    const highs = listTasks(db, { priority: 'high' });
    expect(highs).toHaveLength(1);
    expect(highs[0].title).toBe('Una');
    const todos = listTasks(db, { status: 'todo' });
    expect(todos).toHaveLength(2);
    const dones = listTasks(db, { status: 'done' });
    expect(dones).toHaveLength(0);
  });
});

describe('updateTask', () => {
  it('actualiza parcialmente', () => {
    const t = insertTask(db, { title: 'Original', description: 'desc' });
    const u = updateTask(db, t.id, { title: 'Nuevo' });
    expect(u!.title).toBe('Nuevo');
    expect(u!.description).toBe('desc');
  });

  it('devuelve undefined si no existe', () => {
    expect(updateTask(db, 999, { title: 'X' })).toBeUndefined();
  });
});

describe('updateTaskStatus', () => {
  it('actualiza estado', () => {
    const t = insertTask(db, { title: 'A' });
    const u = updateTaskStatus(db, t.id, 'in-progress');
    expect(u!.status).toBe('in-progress');
  });
});

describe('deleteTask', () => {
  it('elimina y devuelve true', () => {
    const t = insertTask(db, { title: 'A' });
    expect(deleteTask(db, t.id)).toBe(true);
    expect(getTaskById(db, t.id)).toBeUndefined();
  });

  it('devuelve false si no existe', () => {
    expect(deleteTask(db, 999)).toBe(false);
  });
});
