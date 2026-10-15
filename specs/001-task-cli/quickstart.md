# Quickstart: task-cli

## Requisitos

- Node.js LTS (v20+)
- npm

## Instalación (desarrollo)

```bash
npm install
npm run dev -- --help        # ejecuta vía tsx
```

## Instalación global

```bash
npm install -g .
task-cli --help
```

## Validación end-to-end

```bash
# Crear
task-cli add "Comprar leche" --priority high --description "En el super"
# → salida: Tarea 1 creada (todo, high)

# Listar
task-cli list
# → tabla con columnas ID, Título, Estado, Prioridad, Creada

task-cli list --status todo --priority high

# Cambiar estado
task-cli status 1 in-progress
task-cli status 1 done        # OK (in-progress → done)
task-cli status 2 done        # ❌ si la tarea 2 está en todo: transición inválida, código 1

# Actualizar
task-cli update 1 --title "Comprar leche y pan"
task-cli update 1             # ❌ error: indica al menos un campo

# Eliminar
task-cli delete 1             # pide confirmación (s/y para confirmar)
task-cli delete 1 --force
```

## Tests

```bash
npm test        # Vitest: lógica de negocio y acceso a datos
```

## Resultados esperados

- Los comandos exitosos terminan con código 0 y mensajes legibles.
- Los errores muestran mensaje claro en stderr y código 1, sin stack traces.
- Los datos persisten en `~/.task-cli/tasks.db` entre ejecuciones.
