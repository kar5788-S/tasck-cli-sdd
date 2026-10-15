# task-cli

CLI para gestión de tareas personales desde la terminal.

## Instalación global

```bash
npm install -g .
task-cli --help
```

## Desarrollo

```bash
npm install
npm run dev -- --help
npm test
```

## Ejemplos

```bash
# Crear
task-cli add "Comprar leche" --priority high --description "En el super"

# Listar
task-cli list
task-cli list --status todo --priority high

# Cambiar estado
task-cli status 1 in-progress
task-cli status 1 done

# Actualizar
task-cli update 1 --title "Comprar leche y pan"

# Eliminar
task-cli delete 1
task-cli delete 1 --force
```

## Datos

La base de datos se guarda en `~/.task-cli/tasks.db`.
