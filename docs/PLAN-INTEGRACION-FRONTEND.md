# Plan de integración del frontend — Fundación Quintanilla

> Seguimiento de las fases de integración del frontend (`fundacion-quintanilla-front`)
> contra el backend NestJS (`fundacion-quintanilla-back`, rama `develop`).
> Marcar cada casilla al completarla para no perder el hilo.

**Convenciones del backend**
- CRUD por recurso: `GET /` (lista paginada) · `GET /:id` · `POST /` · `PUT /:id` · `PATCH /:id/soft-delete` · `PATCH /:id/restore`.
- Paginación: query params `page` y `size` → respuesta `{ data, pagination: { page, pageSize, total, pageCount } }`.
- Seguridad: JWT + RBAC por permisos (`path`+`method`). Fuente de verdad de DTOs: **Swagger** (`/docs`).
- `POST /auth/signup` **NO se integra en el frontend** (solo crea usuarios por API). `login` ✅ ya integrado.

**Checklist repetible por módulo**
- [ ] Modelo TS en `src/models/api/entities/<Entidad>.ts`
- [ ] Servicio en `src/services/api/` (`new Service<Entidad>({ endpoint })`)
- [ ] Lista (`CrudListView` + columnas)
- [ ] Formulario crear/editar (`useCrud` + `zod`)
- [ ] Detalle (`useFindById`)
- [ ] Soft-delete / restore (acciones de fila → `useCrud.softDelete/restore`)
- [ ] Ruta + página (`src/pages/...`) y entrada de menú con RBAC por rol

---

## ✅ Fase 0 — Fundaciones transversales — **COMPLETADA**

- [x] **Roles (RBAC):**
  - [x] Backend (local, sin commit): `script.sql` + BD → ENCARGADO con `POST /api/historial-expediente` y `PUT /api/residentes/:id` (50 permisos: 48 GET + 2 escritura).
  - [x] Frontend: `ENCARGADO` agregado a `src/enum/role.ts`.
- [x] **Soft-delete / restore en el core:**
  - [x] `AbstractService` (interfaz) + `Service` (PATCH `/:id/soft-delete` y `/:id/restore`).
  - [x] `useCrud` expone `softDelete` / `restore` (+ flags y errores).
- [x] **Plantilla CRUD genérica:** `src/views/core/CrudListView.tsx` (lista paginada reutilizable); `DashboardView` refactorizado para usarla.
- [x] `pnpm check-types` en verde.

> Nota: el `delete` genérico (verbo HTTP DELETE) se mantiene para Usuarios; el negocio usa `softDelete`/`restore`.

---

## ✅ Fase 1 — Núcleo de seguridad y administración — **COMPLETADA** (excepto Uploads)

Infra CRUD reutilizable creada y validada en navegador:
`CrudFormModal` (formulario config-driven), `CrudListView` (lista + toolbar + acciones),
`CrudView` (página CRUD completa: crear/editar/eliminar con soft-delete + Popconfirm).

- [x] **Usuarios** — CRUD completo (`UsersView`): crear/editar/eliminar, select de rol dinámico, protección de self-action (no editarse/borrarse a sí mismo)
- [x] **Roles** — CRUD (`RolesView`): nombre + activo + asignación de permisos (precarga vía `fetchOne`)
- [x] **Permisos** — `PermissionsView`: listar + editar título (sin crear/eliminar)
- [x] **Perfil** — `ProfileView`: `GET/PUT /auth/profile`
- [x] Navegación: `RoutesEnum` + `routesConfig` + menú lateral (Usuarios/Roles/Permisos/Mi perfil) con RBAC
- [ ] **Uploads** — Cloudinary (DIFERIDO: requiere credenciales reales; `.env` del backend tiene placeholders)

> Modelos corregidos de paso: `User` (faltaban `name`/`blocked`), `Permissions` (tipo erróneo), `Role` (+`active`), `RoleName` ampliado para roles arbitrarios.

## ⬜ Fase 2 — Catálogos base (sin dependencias)
- [ ] **Albergues** → **Habitaciones**
- [ ] **Beneficios**
- [ ] **Servicios**

## ⬜ Fase 3 — Persona (entidad raíz) y sub-fichas
- [ ] **Personas** (CRUD + buscador)
- [ ] Grupo familiar
- [ ] Situación laboral
- [ ] Situación académica
- [ ] Economía
- [ ] Persona-beneficio (→ Beneficio)

## ⬜ Fase 4 — Expediente
- [ ] **Expedientes** (1–1 con persona)
- [ ] Historial de expediente (timeline)
- [ ] Valoración profesional

## ⬜ Fase 5 — Residentes y operativa
- [ ] **Residentes** (→ Expediente + Albergue)
- [ ] Ingresos / Egresos
- [ ] Asignación de habitación (→ Habitación)
- [ ] Horario de pupilaje
- [ ] Residente-servicio (→ Servicio)

## ⬜ Fase 6 — Finanzas y reportes
- [ ] Recibos (→ Albergue)
- [ ] Reportes (caso de uso del Admin)

## ⬜ Fase 7 — Vista del rol Encargado
- [ ] Dashboard acotado: su albergue asignado, sus residentes
- [ ] Actualizar estado activo/inactivo de residentes
- [ ] Registrar / consultar historial

---

## Grafo de dependencias (referencia)

```
ALBERGUE → HABITACION → ASIGNACION_HABITACION
ALBERGUE → RESIDENTE → (INGRESO, EGRESO, HORARIO, RESIDENTE_SERVICIO→SERVICIO)
PERSONA 1:1 EXPEDIENTE → (HISTORIAL, VALORACION, RESIDENTE)
PERSONA → (GRUPO_FAMILIAR, SIT_LABORAL, SIT_ACADEMICA, ECONOMIA, PERSONA_BENEFICIO→BENEFICIO)
ALBERGUE → RECIBO
```
