# Contract: CLI commands (task-cli)

Convención general: salida de éxito por stdout con código 0; errores en stderr con mensaje claro y accionable y código 1; nunca se muestra un stack trace.

## `task-cli add <title> [--priority <high|medium|low>] [--description <texto>]`

- Crea una tarea con estado `todo` e ID autoincremental.
- `title` obligatorio; vacío → error, código 1.
- `--priority` inválido → error listando valores válidos, código 1.
- Éxito: mensaje con ID, título, prioridad y estado; código 0.

## `task-cli list [--status <todo|in-progress|done>] [--priority <high|medium|low>]`

- Lista tareas en tabla con columnas: ID, Título, Estado, Prioridad, Creada (`YYYY-MM-DD HH:mm`).
- Filtros combinables (AND). Valores inválidos → error, código 1.
- Orden: `created_at` descendente por defecto.
- Sin tareas → mensaje "No hay tareas", código 0.

## `task-cli status <id> <todo|in-progress|done>`

- Cambia el estado aplicando la máquina de transiciones.
- Transición inválida (p. ej. todo → done) → error explicativo, código 1, sin modificar.
- ID inexistente o estado inválido → error, código 1.

## `task-cli update <id> [--title <t>] [--description <d>] [--priority <p>]`

- Actualiza solo los campos indicados.
- Sin campos → error accionable, código 1.
- ID inexistente, título vacío, prioridad inválida → error, código 1.

## `task-cli delete <id> [--force]`

- Pide confirmación interactiva; solo "s"/"y" confirma; cualquier otra entrada cancela (mensaje de cancelación, código 0).
- `--force` omite la confirmación.
- ID inexistente → error, código 1.
