# Data Model: task-cli

## Entity: Task

Representa una tarea personal gestionada desde la terminal.

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT; nunca se reutiliza tras borrar |
| title | TEXT | NOT NULL, no vacío ni solo espacios |
| description | TEXT | NULL permitido |
| priority | TEXT | NOT NULL, uno de: `high`, `medium`, `low`; default `medium` |
| status | TEXT | NOT NULL, uno de: `todo`, `in-progress`, `done`; default `todo` |
| created_at | TEXT | NOT NULL, ISO 8601 UTC (ej. `2026-10-01T14:32:00Z`) |

## Validation rules

- `title`: obligatorio, no vacío, se recorta (trim) antes de validar.
- `priority` y `status`: solo valores del enum; valores inválidos se rechazan con error que lista los válidos y código 1.
- En `update`: al menos un campo (title, description o priority) debe estar presente; si no, error con código 1.

## State transitions

Estados: `todo` → `in-progress` → `done`, con retrocesos `in-progress` → `todo` y `done` → `todo`.

| Desde | A | ¿Válida? |
|-------|---|----------|
| todo | in-progress | ✅ |
| in-progress | done | ✅ |
| in-progress | todo | ✅ |
| done | todo | ✅ |
| todo | done | ❌ (error claro, no modifica) |
| cualquier otra combinación | | ❌ |

Función pura de dominio: `esTransicionValida(actual, nuevo): boolean`.

## Storage

- Archivo SQLite en `~/.task-cli/tasks.db` (directorio creado si no existe).
- Tabla `tasks` creada con migración idempotente al arrancar (`CREATE TABLE IF NOT EXISTS`).
- Sin relaciones con otras entidades en esta versión.
