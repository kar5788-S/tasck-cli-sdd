import type { Database } from 'better-sqlite3';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'done';
  created_at: string;
}

export interface NewTask {
  title: string;
  description?: string | null;
  priority?: 'high' | 'medium' | 'low';
}

export interface TaskFilters {
  status?: string;
  priority?: string;
}

export function insertTask(db: Database, task: NewTask): Task {
  const priority = task.priority ?? 'medium';
  const createdAt = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const info = db
    .prepare('INSERT INTO tasks (title, description, priority, status, created_at) VALUES (?, ?, ?, ?, ?)')
    .run(task.title, task.description ?? null, priority, 'todo', createdAt);
  return getTaskById(db, Number(info.lastInsertRowid))!;
}

export function getTaskById(db: Database, id: number): Task | undefined {
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task | undefined;
}

export function listTasks(db: Database, filters: TaskFilters = {}): Task[] {
  const conditions: string[] = [];
  const params: string[] = [];
  if (filters.status) {
    conditions.push('status = ?');
    params.push(filters.status);
  }
  if (filters.priority) {
    conditions.push('priority = ?');
    params.push(filters.priority);
  }
  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  return db
    .prepare(`SELECT * FROM tasks ${where} ORDER BY created_at DESC, id DESC`)
    .all(...params) as Task[];
}

export interface TaskUpdates {
  title?: string;
  description?: string | null;
  priority?: 'high' | 'medium' | 'low';
}

export function updateTask(db: Database, id: number, updates: TaskUpdates): Task | undefined {
  const existing = getTaskById(db, id);
  if (!existing) return undefined;
  const title = updates.title !== undefined ? updates.title : existing.title;
  const description = updates.description !== undefined ? updates.description : existing.description;
  const priority = updates.priority !== undefined ? updates.priority : existing.priority;
  db.prepare('UPDATE tasks SET title = ?, description = ?, priority = ? WHERE id = ?').run(title, description, priority, id);
  return getTaskById(db, id);
}

export function updateTaskStatus(db: Database, id: number, status: string): Task | undefined {
  const existing = getTaskById(db, id);
  if (!existing) return undefined;
  db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run(status, id);
  return getTaskById(db, id);
}

export function deleteTask(db: Database, id: number): boolean {
  const info = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  return info.changes > 0;
}
