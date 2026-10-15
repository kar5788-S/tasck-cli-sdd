# Implementation Plan: task-cli

**Branch**: `001-task-cli` | **Date**: 2026-10-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-task-cli/spec.md`

## Summary

CLI de gestión de tareas personales (`task-cli`) con comandos para crear, listar (con filtros y orden), cambiar estado (con máquina de transiciones válidas), actualizar y eliminar tareas con confirmación. Persistencia local en SQLite vía better-sqlite3 en `~/.task-cli/tasks.db`, UI con Commander.js y tablas con cli-table3, tests con Vitest.

## Technical Context

**Language/Version**: TypeScript sobre Node.js LTS (v20+), ejecución directa con tsx

**Primary Dependencies**: commander, better-sqlite3, cli-table3

**Storage**: SQLite (archivo local `~/.task-cli/tasks.db`) vía better-sqlite3; sin ORM

**Testing**: Vitest (tests unitarios de la lógica de negocio)

**Target Platform**: Terminal de escritorio (Windows/macOS/Linux), CLI instalable con `npm install -g`

**Project Type**: cli

**Performance Goals**: Operaciones de listar/crear/actualizar/eliminar < 1s con hasta 1000 tareas

**Constraints**: Sin stack traces al usuario; códigos de salida 0/1; mensajes en español; colores solo para estados y prioridades; sin dependencias innecesarias

**Scale/Scope**: Uso personal de un solo usuario; base de datos local pequeña (cientos/miles de filas)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Estado | Evidencia |
|-----------|--------|-----------|
| I. TypeScript + Node LTS + tsx | ✅ | Lenguaje/runtime fijados en Technical Context |
| II. SQLite con better-sqlite3 | ✅ | Storage fijado; `~/.task-cli/tasks.db` |
| III. Estructura simple: commands/, db/, utils/ | ✅ | Estructura de proyecto refleja esta organización |
| IV. Estilo funcional, camelCase | ✅ | Lógica de negocio como funciones puras en utils/ y db/ |
| V. Commander.js | ✅ | CLI con Commander |
| VI. Errores claros, códigos 0/1 | ✅ | Cubierto en Constraints y requisitos FR-010 |
| VII. Vitest para lógica de negocio | ✅ | Testing fijado a Vitest |
| VIII. Sin dependencias innecesarias ni ORM | ✅ | Solo commander, better-sqlite3, cli-table3 |
| IX. Output legible con tablas | ✅ | cli-table3 para listado |
| X. Instalable con `npm install -g` | ✅ | Project Type cli con bin |

Gate: **PASS** — sin violaciones.

## Project Structure

### Documentation (this feature)

```text
specs/001-task-cli/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── index.ts           # Punto de entrada; registra comandos Commander
├── commands/
│   ├── add.ts         # task-cli add "<título>" [--priority ...] [--description ...]
│   ├── list.ts        # task-cli list [--status ...] [--priority ...]
│   ├── status.ts      # task-cli status <id> <nuevo-estado>
│   ├── update.ts      # task-cli update <id> [--title ...] [--description ...] [--priority ...]
│   └── delete.ts      # task-cli delete <id> [--force]
├── db/
│   ├── connection.ts  # Apertura/creación de ~/.task-cli/tasks.db y migración
│   └── tasks.ts       # Funciones de acceso a datos (CRUD + filtros)
└── utils/
    ├── tasks.ts       # Lógica de negocio pura (validaciones, transiciones)
    ├── format.ts      # Formateo de tabla y colores
    └── errors.ts      # Mensajes de error y códigos de salida

tests/
├── tasks.test.ts      # Tests de lógica de negocio (transiciones, validaciones)
└── db.test.ts         # Tests de acceso a datos con BD temporal
```

**Structure Decision**: Estructura plana única por funcionalidad (commands/, db/, utils/) conforme a la constitución, sin capas adicionales.

## Complexity Tracking

> Sin violaciones de constitución que justificar.
