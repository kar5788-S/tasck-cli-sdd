# Feature Specification: task-cli

**Feature Branch**: `001-task-cli`

**Created**: 2026-10-01

**Status**: Draft

**Input**: User description: "Construir un CLI llamado \"task-cli\" para gestión de tareas personales desde la terminal."

## Clarifications

### Session 2026-10-01

- Q: ¿Cómo debe mostrarse la fecha de creación en la tabla de listado? → A: Fecha y hora legible con formato `YYYY-MM-DD HH:mm` (p. ej., `2026-10-01 14:32`).
- Q: ¿Qué debe ocurrir cuando el usuario ejecuta `update` sin especificar ningún campo a modificar? → A: Error con mensaje accionable y código de salida 1.
- Q: ¿Qué entrada del usuario confirma o cancela la eliminación interactiva? → A: Escribir "s"/"y" confirma; cualquier otra entrada (incluido Enter vacío) cancela la eliminación.
- Q: ¿Cómo debe comportarse el CLI ante valores inválidos en `--status`, `--priority` o en el nuevo estado? → A: Rechazar con error claro que liste los valores válidos y código de salida 1.
- Q: Tras eliminar tareas, ¿los IDs numéricos de tareas nuevas deben reutilizarse o siempre incrementar? → A: Siempre incrementar; los IDs de tareas eliminadas no se reutilizan.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Crear tareas (Priority: P1)

El usuario crea una tarea desde la terminal con un título obligatorio, y opcionalmente una prioridad (high, medium, low; por defecto medium) y una descripción. Cada tarea recibe un ID numérico autoincremental y nace con estado "todo".

**Why this priority**: Es la operación fundamental; sin tareas no existe el resto de funcionalidad.

**Independent Test**: Ejecutar el comando de creación con un título y verificar que la tarea aparece con ID incremental, prioridad por defecto medium y estado todo.

**Acceptance Scenarios**:

1. **Given** la base de datos vacía, **When** el usuario crea una tarea con solo un título, **Then** se crea con ID 1, prioridad medium y estado todo.
2. **Given** tareas existentes, **When** el usuario crea una tarea con prioridad high y descripción, **Then** se crea con el siguiente ID incremental y los valores indicados.
3. **Given** el comando de creación, **When** el usuario no proporciona título, **Then** el CLI muestra un error claro y no crea nada.

---

### User Story 2 - Listar tareas (Priority: P2)

El usuario lista todas sus tareas en formato tabla mostrando ID, título, estado, prioridad y fecha de creación. Puede filtrar por estado (`--status`) y prioridad (`--priority`), y las tareas se ordenan por fecha de creación, las más recientes primero por defecto.

**Why this priority**: Permite ver el trabajo pendiente; es la consulta principal tras crear tareas.

**Independent Test**: Cargar varias tareas con distintos estados y prioridades y verificar que el listado muestra la tabla correcta, respeta filtros y orden por defecto.

**Acceptance Scenarios**:

1. **Given** varias tareas, **When** el usuario ejecuta el listado sin filtros, **Then** ve todas en tabla ordenadas por fecha de creación descendente.
2. **Given** tareas con varios estados, **When** el usuario usa `--status done`, **Then** solo aparecen las tareas en estado done.
3. **Given** tareas con varias prioridades, **When** el usuario usa `--priority high`, **Then** solo aparecen las tareas de prioridad high.

---

### User Story 3 - Cambiar estado de una tarea (Priority: P3)

El usuario cambia el estado de una tarea por su ID. Estados válidos: todo, in-progress, done. Transiciones válidas: todo → in-progress, in-progress → done, in-progress → todo, done → todo. Transiciones inválidas (como todo → done) se rechazan con un mensaje claro.

**Why this priority**: Da seguimiento al avance del trabajo; depende de crear y listar.

**Independent Test**: Intentar cada transición válida e inválida y verificar que el estado se actualiza o se rechaza correctamente.

**Acceptance Scenarios**:

1. **Given** una tarea en estado todo, **When** el usuario la pasa a in-progress, **Then** el estado queda en in-progress.
2. **Given** una tarea en estado in-progress, **When** el usuario la pasa a done, **Then** el estado queda en done.
3. **Given** una tarea en estado todo, **When** el usuario intenta pasarla directamente a done, **Then** el CLI rechaza la transición con un mensaje claro y no modifica la tarea.
4. **Given** una tarea en estado done, **When** el usuario la reabre a todo, **Then** el estado queda en todo.

---

### User Story 4 - Actualizar una tarea (Priority: P4)

El usuario modifica el título, la descripción o la prioridad de una tarea existente por su ID.

**Why this priority**: Necesario para corregir o refinar tareas; menos crítico que el flujo principal.

**Independent Test**: Actualizar cada campo de una tarea y verificar que solo ese campo cambia.

**Acceptance Scenarios**:

1. **Given** una tarea existente, **When** el usuario actualiza su título, **Then** el título cambia y el resto de campos se mantiene.
2. **Given** una tarea existente, **When** el usuario actualiza prioridad y descripción, **Then** ambos campos se actualizan.
3. **Given** un ID inexistente, **When** el usuario intenta actualizar, **Then** el CLI muestra un error claro.

---

### User Story 5 - Eliminar una tarea (Priority: P5)

El usuario elimina una tarea por su ID. El CLI pide confirmación antes de eliminar, salvo que se pase `--force`.

**Why this priority**: Operación destructiva secundaria; requiere salvaguardas.

**Independent Test**: Eliminar con confirmación, cancelar confirmación y eliminar con `--force`, verificando el estado de la tarea en cada caso.

**Acceptance Scenarios**:

1. **Given** una tarea existente, **When** el usuario confirma la eliminación, **Then** la tarea se elimina.
2. **Given** una tarea existente, **When** el usuario cancela la confirmación, **Then** la tarea no se elimina.
3. **Given** una tarea existente, **When** el usuario usa `--force`, **Then** la tarea se elimina sin pedir confirmación.

---

### Edge Cases

- ¿Qué ocurre al listar cuando no hay tareas? Debe mostrarse un mensaje claro (p. ej., "No hay tareas") en vez de una tabla vacía confusa.
- ¿Qué ocurre al referenciar un ID inexistente en actualizar, cambiar estado o eliminar? Debe fallar con mensaje claro y código de salida 1.
- ¿Qué ocurre con un título vacío o solo espacios? Debe rechazarse con código de salida 1.
- ¿Qué ocurre con valores inválidos en `--status`, `--priority` o en el nuevo estado? El CLI debe rechazarlos con un error que liste los valores válidos y código de salida 1 (no ignorarlos).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir crear una tarea con título obligatorio, prioridad opcional (high, medium, low; default medium) y descripción opcional.
- **FR-002**: El sistema MUST asignar a cada tarea un ID numérico autoincremental y estado inicial "todo". Los IDs no se reutilizan aunque se eliminen tareas.
- **FR-003**: El sistema MUST listar las tareas en formato tabla con columnas: ID, título, estado, prioridad y fecha de creación mostrada como `YYYY-MM-DD HH:mm`.
- **FR-004**: El sistema MUST permitir filtrar el listado por estado (`--status todo|in-progress|done`) y por prioridad (`--priority high|medium|low`).
- **FR-005**: El sistema MUST ordenar el listado por fecha de creación, las más recientes primero por defecto.
- **FR-006**: El sistema MUST permitir cambiar el estado de una tarea por su ID con las transiciones válidas definidas (todo → in-progress, in-progress → done, in-progress → todo, done → todo).
- **FR-007**: El sistema MUST rechazar transiciones de estado inválidas (en particular todo → done) con mensaje claro y sin modificar la tarea.
- **FR-008**: El sistema MUST permitir actualizar título, descripción o prioridad de una tarea existente por su ID. Si no se especifica ningún campo a modificar, MUST fallar con mensaje accionable y código de salida 1.
- **FR-009**: El sistema MUST pedir confirmación antes de eliminar una tarea, salvo que se indique `--force`. La confirmación se considera solo al escribir "s" o "y"; cualquier otra entrada cancela la eliminación.
- **FR-010**: El sistema MUST mostrar mensajes de error claros y accionables y usar código de salida 0 en éxito y 1 en error, sin stack traces.
- **FR-011**: El sistema NO DEBE implementar autenticación, sincronización, fechas de vencimiento, subtareas, tags ni interfaz web/API REST en esta versión.

### Key Entities *(include if feature involves data)*

- **Task**: Representa una tarea personal. Atributos: id numérico autoincremental, título (obligatorio), descripción (opcional), prioridad (high | medium | low, default medium), estado (todo | in-progress | done, inicial todo), fecha de creación.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario puede crear una tarea en menos de 30 segundos desde la terminal.
- **SC-002**: El listado muestra correctamente todas las tareas con sus filtros aplicados en el 100% de los casos verificables.
- **SC-003**: El 100% de las transiciones de estado inválidas son rechazadas sin modificar datos.
- **SC-004**: El 100% de los errores muestran mensajes claros con código de salida 1, sin stack traces.
- **SC-005**: Las operaciones de listar, crear, actualizar y eliminar responden en menos de 1 segundo con hasta 1000 tareas.

## Assumptions

- El usuario es un solo usuario local; no hay multiusuario ni concurrencia entre procesos que requiera bloqueo complejo.
- La confirmación de eliminación se realiza por entrada interactiva en la terminal.
- La fecha de creación se registra internamente en formato ISO 8601 y se muestra en el listado como `YYYY-MM-DD HH:mm`.
- El idioma de la interfaz y mensajes es español, salvo identificadores técnicos.
