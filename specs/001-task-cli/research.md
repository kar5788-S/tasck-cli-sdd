# Research: task-cli

## Decision 1: better-sqlite3 como driver SQLite

- **Rationale**: La constitución lo fija; es síncrono, simple y sin dependencias nativas externas problemáticas para un CLI.
- **Alternatives considered**: node:sqlite (experimental), sql.js (WASM, más complejo), ORMs como Prisma (prohibidos por constitución).

## Decision 2: Commander.js para parsing de la CLI

- **Rationale**: Fijado por la constitución; estándar maduro para subcomandos y flags.
- **Alternatives considered**: yargs (más pesado), parseo manual (más código y peor UX de ayuda).

## Decision 3: cli-table3 para listados en tabla

- **Rationale**: Fijado por la constitución ("cli-table3 o similar"); renderiza tablas bien alineadas en terminal.
- **Alternatives considered**: table (similar complejidad), formateo manual (frágil con anchos variables).

## Decision 4: Almacenamiento en `~/.task-cli/tasks.db` con creación automática del directorio

- **Rationale**: La constitución define la ruta; crear el directorio si no existe evita errores de primer uso.
- **Alternatives considered**: ruta relativa al CWD (se perderían datos según dónde se ejecute).

## Decision 5: Confirmación de eliminación por stdin ("s"/"y" confirma)

- **Rationale**: Clarificado en la spec; cualquier otra entrada cancela, por defecto cancela. `--force` omite la pregunta.
- **Alternatives considered**: prompts interactivos con librerías (dependencia innecesaria).

## Decision 6: Máquina de transiciones de estado explícita

- **Rationale**: La spec define transiciones válidas/inválidas; una función pura `esTransicionValida(actual, nuevo)` es testeable con Vitest.
- **Alternatives considered**: permitir cualquier transición (rechazado por la spec).

## Decision 7: Ejecución con tsx y bin instalable globalmente

- **Rationale**: La constitución exige tsx o similar y `npm install -g`; se define `bin` en package.json apuntando a un entry con shebang ejecutado vía tsx.
- **Alternatives considered**: compilar con tsc (más pasos; rechazado para desarrollo, aunque viable para distribución).
