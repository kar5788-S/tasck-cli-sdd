import Database from 'better-sqlite3';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const DEFAULT_DB_DIR = path.join(os.homedir(), '.task-cli');
export const DEFAULT_DB_PATH = path.join(DEFAULT_DB_DIR, 'tasks.db');

export function createConnection(dbPath: string = DEFAULT_DB_PATH): Database.Database {
  if (dbPath !== ':memory:') {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.exec(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'todo',
    created_at TEXT NOT NULL
  )`);
  return db;
}
