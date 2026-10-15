<!--
Sync Impact Report
- Version: (sin versión previa) → 1.0.0
- Principios modificados: n/a (constitución inicial)
- Secciones añadidas: Core Principles (10 principios derivados de reglas.md), Technology Stack, Development Workflow
- Secciones eliminadas: n/a
- TODOs pendientes: ninguno
-->
# task-cli Constitution

## Core Principles

### I. TypeScript con Node.js LTS

El proyecto se escribe en TypeScript ejecutándose sobre Node.js en su versión LTS.
La ejecución directa se realiza con tsx o una herramienta equivalente. No se usa
ningún otro lenguaje ni runtime.

### II. SQLite con better-sqlite3

Toda la persistencia usa SQLite a través de la librería better-sqlite3. La base de
datos vive en un archivo local en el directorio del usuario (`~/.task-cli/tasks.db`).
No se usan motores de base de datos externos ni ORMs.

### III. Estructura simple y plana

Se mantiene una estructura de proyecto simple y plana. No se aplica clean
architecture ni capas excesivas para un CLI de este tamaño. La organización se
hace por funcionalidad: `commands/`, `db/`, `utils/`.

### IV. Estilo de código funcional

Estilo funcional sobre clases. Se usan funciones puras siempre que sea posible.
camelCase para variables y funciones; PascalCase únicamente para tipos e
interfaces.

### V. Commander.js para la CLI

El parseo de argumentos y comandos se implementa con Commander.js. No se
introducen frameworks CLI alternativos.

### VI. Manejo de errores claro

Nunca se muestran stack traces al usuario. Los mensajes deben ser claros y
accionables. Se usan códigos de salida apropiados: 0 para éxito, 1 para error.

### VII. Testing con Vitest

Los tests unitarios se escriben con Vitest. No se exige cobertura mínima, pero
toda la lógica de negocio debe tener tests.

### VIII. Sin dependencias innecesarias

No se agregan librerías para funcionalidad que se pueda resolver con pocas
líneas de código. No se usan ORMs.

### IX. Output legible

Toda salida al terminal debe ser legible. Los listados se muestran en tablas
(con cli-table3 o similar). Los colores se usan solo para estados y prioridades.

### X. Instalable globalmente

El CLI debe ser instalable globalmente con `npm install -g`.

## Technology Stack

TypeScript, Node.js LTS, better-sqlite3, Commander.js, Vitest, cli-table3 (o
similar), tsx para ejecución directa. Cualquier adición a este stack requiere
justificación conforme al principio VIII.

## Development Workflow

Toda lógica de negocio se acompaña de tests con Vitest antes de considerarse
completa. Los mensajes al usuario, documentos y comentarios se escriben en
español; solo los términos técnicos y los identificadores del código permanecen
en inglés.

## Governance

Esta constitución prevalece sobre cualquier otra práctica del proyecto. Las
enmiendas requieren documentación de los cambios, aprobación del mantenedor y
actualización del número de versión según versionado semántico (MAJOR para
cambios incompatibles, MINOR para nuevos principios o secciones, PATCH para
clarificaciones). Toda revisión debe verificar el cumplimiento de estos
principios.

**Version**: 1.0.0 | **Ratified**: 2026-10-01 | **Last Amended**: 2026-10-01
