# Tasks: task-cli

**Input**: Design documents from `/specs/001-task-cli/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Incluidos — la constitución exige tests con Vitest para toda lógica de negocio.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1..US5 según spec.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization

- [X] T001 Inicializar package.json con nombre task-cli, bin `task-cli`, scripts (`dev`, `test`, `start`) y type module
- [X] T002 Instalar dependencias: commander, better-sqlite3, cli-table3, y dev: typescript, tsx, vitest, @types/node, @types/better-sqlite3
- [X] T003 Configurar tsconfig.json (strict, module nodenext, outDir dist)
- [X] T004 [P] Configurar vitest.config.ts
- [X] T005 [P] Crear estructura de carpetas: src/commands/, src/db/, src/utils/, tests/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure que bloquea todas las historias

- [X] T006 Implementar conexión a BD en src/db/connection.ts (crear ~/.task-cli/tasks.db si no existe, `CREATE TABLE IF NOT EXISTS tasks`)
- [X] T007 Implementar funciones CRUD en src/db/tasks.ts (insertTask, getTaskById, listTasks con filtros y orden created_at DESC, updateTask, updateTaskStatus, deleteTask)
- [X] T008 Implementar lógica de negocio pura en src/utils/tasks.ts (validarTítulo obligatorio, normalizar prioridad/estado, esTransicionValida)
- [X] T009 Implementar manejo de errores en src/utils/errors.ts (mensaje claro a stderr, código de salida 1, sin stack traces)
- [X] T010 Implementar formateo de salida en src/utils/format.ts (tabla con cli-table3, fecha `YYYY-MM-DD HH:mm`, colores solo para estado y prioridad)
- [X] T011 Crear punto de entrada src/index.ts registrando los comandos de Commander
- [X] T012 [P] Tests de lógica de negocio en tests/tasks.test.ts (validaciones y esTransicionValida: todo→done inválida, ciclos válidos)
- [X] T013 [P] Tests de acceso a datos en tests/db.test.ts con BD temporal

**Checkpoint**: Foundation lista — las historias pueden empezar

---

## Phase 3: User Story 1 - Crear tareas (Priority: P1) 🎯 MVP

**Goal**: Permitir crear tareas con título, prioridad y descripción, con ID incremental y estado todo

**Independent Test**: `task-cli add "Título"` crea la tarea; aparecen ID correcto, prioridad por defecto medium y estado todo; título vacío → error código 1

### Tests for User Story 1

- [X] T014 [P] [US1] Test de inserción de tarea con defaults en tests/db.test.ts

### Implementation for User Story 1

- [X] T015 [US1] Implementar comando add en src/commands/add.ts (args: title, --priority, --description) con validaciones de FR-001/FR-002
- [X] T016 [US1] Registrar comando add en src/index.ts
- [X] T017 [US1] Verificar manualmente con quickstart.md que add crea la tarea correctamente

**Checkpoint**: US1 funcional y testeable de forma independiente (MVP)

---

## Phase 4: User Story 2 - Listar tareas (Priority: P2)

**Goal**: Listar tareas en tabla con filtros por estado/prioridad y orden por fecha desc

**Independent Test**: Con varias tareas, `task-cli list` muestra tabla ordenada; `--status` y `--priority` filtran; lista vacía muestra "No hay tareas"

### Tests for User Story 2

- [X] T018 [P] [US2] Test de filtros y orden en listTasks en tests/db.test.ts

### Implementation for User Story 2

- [X] T019 [US2] Implementar comando list en src/commands/list.ts (--status, --priority) usando format.ts para la tabla
- [X] T020 [US2] Validar filtros inválidos con error código 1 en src/commands/list.ts
- [X] T021 [US2] Registrar comando list en src/index.ts

**Checkpoint**: US1 y US2 funcionan independientemente

---

## Phase 5: User Story 3 - Cambiar estado de una tarea (Priority: P3)

**Goal**: Cambiar estado por ID respetando la máquina de transiciones

**Independent Test**: Transiciones válidas actualizan; todo→done se rechaza con código 1 y sin modificar la tarea

### Tests for User Story 3

- [X] T022 [P] [US3] Tests de cada transición válida e inválida en tests/tasks.test.ts

### Implementation for User Story 3

- [X] T023 [US3] Implementar comando status en src/commands/status.ts usando esTransicionValida
- [X] T024 [US3] Rechazar ID inexistente, estado inválido y transición inválida con error código 1
- [X] T025 [US3] Registrar comando status en src/index.ts

**Checkpoint**: US1–US3 funcionan independientemente

---

## Phase 6: User Story 4 - Actualizar una tarea (Priority: P4)

**Goal**: Actualizar título, descripción o prioridad por ID

**Independent Test**: Actualizar cada campo; sin campos → error código 1; ID inexistente → error código 1

### Tests for User Story 4

- [X] T026 [P] [US4] Test de update parcial en tests/db.test.ts

### Implementation for User Story 4

- [X] T027 [US4] Implementar comando update en src/commands/update.ts (--title, --description, --priority) con validación de al menos un campo
- [X] T028 [US4] Registrar comando update en src/index.ts

**Checkpoint**: US1–US4 funcionan independientemente

---

## Phase 7: User Story 5 - Eliminar una tarea (Priority: P5)

**Goal**: Eliminar por ID con confirmación interactiva ("s"/"y" confirma; otra entrada cancela) y --force

**Independent Test**: Confirmar con "s" elimina; cancelar no elimina; --force elimina sin preguntar; ID inexistente → error código 1

### Tests for User Story 5

- [X] T029 [P] [US5] Test de deleteTask en tests/db.test.ts

### Implementation for User Story 5

- [X] T030 [US5] Implementar comando delete en src/commands/delete.ts con lectura de confirmación por stdin salvo --force
- [X] T031 [US5] Registrar comando delete en src/index.ts

**Checkpoint**: Todas las historias funcionan independientemente

---

## Phase 8: Polish & Cross-Cutting Concerns

- [X] T032 [P] Completar README con instalación global `npm install -g` y ejemplos (quickstart)
- [X] T033 [P] Verificar bin global: `npm install -g .` y ejecutar `task-cli --help`
- [X] T034 [P] Ejecutar tests completos con `npm test` y corregir fallos
- [X] T035 Validar flujo end-to-end de quickstart.md
- [X] T036 Revisar que ningún mensaje de error muestre stack traces

---

## Dependencies & Execution Order

- Setup (Phase 1): sin dependencias
- Foundational (Phase 2): depende de Setup; bloquea todas las historias
- US1–US5 (Phases 3–7): dependen de Foundational; pueden ejecutarse en paralelo o en orden P1→P5
- Polish (Phase 8): depende de las historias deseadas completadas

## Parallel Opportunities

- T004, T005 en paralelo (Phase 1)
- T012, T013 en paralelo (Phase 2)
- Tests de cada historia (T014, T018, T022, T026, T029) en paralelo entre sí
- Historias distintas en paralelo por distintos desarrolladores

## Implementation Strategy

### MVP First (US1 solamente)

1. Phase 1 Setup → Phase 2 Foundational → Phase 3 US1
2. Validar US1 con quickstart.md y parar

### Incremental Delivery

1. Setup + Foundational → base lista
2. US1 → validar → MVP
3. US2 → validar; US3 → validar; US4 → validar; US5 → validar
4. Polish final
