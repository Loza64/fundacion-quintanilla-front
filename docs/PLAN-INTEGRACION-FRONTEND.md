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

**Búsqueda y filtros genéricos** (dinámicos desde la base, validados en navegador):
- Búsqueda: el input "Buscar" del header se conecta al param `search` del backend (debounce 350ms) en todo `CrudView`.
- Filtros: prop `filters` declarativa (`CrudFilter[]`) → selects en el toolbar que mandan los query params tipados del módulo. Demostrado en Usuarios (Rol + Estado).
- Convención backend: `search`/`sort`/`page`/`size` son base compartida (`BaseQuerys`); los campos de búsqueda y filtros tipados son por entidad.
- Backend (LOCAL, sin commit): se corrigió `persona.controller` que ignoraba search/filtros; ahora usa `parseSearch`/`parseSort` como el resto.

- [x] **Usuarios** — CRUD completo (`UsersView`): crear/editar/eliminar, select de rol dinámico, protección de self-action (no editarse/borrarse a sí mismo)
- [x] **Roles** — CRUD (`RolesView`): nombre + activo + asignación de permisos (precarga vía `fetchOne`)
- [x] **Permisos** — `PermissionsView`: listar + editar título (sin crear/eliminar)
- [x] **Perfil** — `ProfileView`: `GET/PUT /auth/profile`
- [x] Navegación: `RoutesEnum` + `routesConfig` + menú lateral (Usuarios/Roles/Permisos/Mi perfil) con RBAC
- [ ] **Uploads** — Cloudinary (DIFERIDO: requiere credenciales reales; `.env` del backend tiene placeholders)

> Modelos corregidos de paso: `User` (faltaban `name`/`blocked`), `Permissions` (tipo erróneo), `Role` (+`active`), `RoleName` ampliado para roles arbitrarios.

## ✅ Fase 2 — Catálogos base — **COMPLETADA**

- [x] **Albergues** (`AlbergueView`): CRUD + select de encargado + filtro por tipo
- [x] **Habitaciones** (`HabitacionView`): CRUD con tipo/estado; funciona standalone (dropdown de albergue) **y** embebida (scopeada)
- [x] **Beneficios** (`BeneficioView`): CRUD plano por tipo
- [x] **Servicios** (`ServicioView`): CRUD plano por tipo + precio
- [x] Búsqueda/filtros genéricos + enums humanizados (`utils/options`, `enum/catalog`)
- [x] Rutas + menú (8 ítems) + páginas

**Nuevo en la infra: Relation Managers (estilo Filament)**
- `CrudView` ahora soporta `relations` (tabs de hijas en un drawer "Ver"), `summary`
  (resumen del padre), `scopeParams` (filtro fijo del padre) y `defaults` (inyecta el
  padre al guardar). Componente `CrudDetailDrawer`.
- Demostrado en **Albergue → Habitaciones**: botón "Ver" abre el detalle con un tab de
  habitaciones que hace CRUD scopeado al albergue (sin pedir el albergue en el formulario).
  La página `/habitaciones` standalone sigue disponible.

**Backend (LOCAL, sin commit) — bugs corregidos:**
- `persona.controller` ignoraba search/filtros → ahora usa `parseSearch`/`parseSort`.
- `habitacion` create DTO: `capacidad` tenía `@IsString()` además de `@IsInt()` → quitado.
- `habitacion.controller`: lógica de `isDeleted` invertida (devolvía vacío) → corregida.

## ✅ Fase 3 — Persona y sub-fichas — **COMPLETADA**

- [x] **Personas** (`PersonaView`): CRUD + buscador + filtros (sexo, estado civil)
- [x] **5 sub-fichas como relation managers** en el detalle de la persona (tabs scopeados):
  Grupo familiar, Situación laboral, Situación académica, Economía, Beneficios (→ Beneficio)
- [x] Cada sub-ficha hace CRUD scopeado a la persona (sin pedir la persona en el form)

**Nuevo en la infra:**
- Campo `date` (`CrudFormModal` con `DatePicker` + conversión dayjs ↔ string genérica).
- Validado en navegador: persona con fecha de nacimiento + familiar creado desde el tab.

**Backend (LOCAL, sin commit) — bug corregido:**
- `economia` no tenía filtro `persona` (querys + controller) → agregado para el scoping.

## ✅ Fase 4 — Expediente — **COMPLETADA**

- [x] **Expedientes** (`ExpedienteView`): standalone + scopeado en Persona (tab Expediente)
- [x] **Historial de expediente** (relation manager scopeado por expediente)
- [x] **Valoración profesional** (relation manager scopeado por expediente)

**Relation managers ANIDADOS (2 niveles) validados en navegador:**
`Persona → Ver → tab Expediente → Ver → drawer anidado con tabs Historial/Valoraciones`.
Los drawers de Ant Design se apilan correctamente; el CRUD scopeado funciona en cada nivel
(creé un evento de historial desde el nivel más profundo). La infra soporta N niveles porque
cada tab hija es un `CrudView` que a su vez acepta `relations`.

**Backend (LOCAL, sin commit) — bugs corregidos:**
- `Expediente.persona` (OneToOne) NO tenía `@JoinColumn` → el módulo expediente **siempre daba 500**.
  Agregado `@JoinColumn({ name: 'persona_id' })` (synchronize creó la columna + FK).
- `expediente` no tenía filtro `persona` → agregado (querys + controller).
- `historial-expediente` y `grupo-familiar`: lógica `isDeleted` invertida (listas vacías) → corregida.

## ✅ Fase 5 — Residentes y operativa — **COMPLETADA**

- [x] **Residentes** (`ResidenteView`): standalone (selects Expediente + Albergue) + scopeado en Expediente (tab Residentes)
- [x] **Ingresos / Egresos** (relation managers scopeados por residente)
- [x] **Asignación de habitación** (→ Habitación, con select)
- [x] **Horario de pupilaje** (día + entrada/salida)
- [x] **Residente-servicio** (→ Servicio, con select)

**Cadena de 3 niveles validada:** `Persona → Expediente → Residente → Ingreso/Egreso/...`.
El residente tiene 5 relation managers; creé un ingreso desde el nivel más profundo.

**Mejora de UX:** los dropdowns de **Filtros** ahora tienen búsqueda (`showSearch`),
igual que los del formulario (que ya la tenían).

> Sin cambios de backend en esta fase (escaneo de `isDeleted` limpio; filtros y relaciones presentes).

## ✅ Fase 6 — Finanzas y reportes — **COMPLETADA**

- [x] **Recibos** (`ReciboView`): standalone (`/recibos`) + tabs en **Albergue** y **Residente**
  (scopeable por albergue o por residente; albergue requerido, residente opcional)
- [x] **Reportes** (`ReportesView`): dashboard de estadísticas (`/reportes`) con tarjetas de totales
  (personas, residentes activos/total, albergues, habitaciones, expedientes, beneficios, servicios, recibos)

> Reportes se construye agregando el `total` de los endpoints de lista existentes (no hay
> endpoint de reportes en el backend). Posible extensión futura: exportar a CSV/PDF.
> Sin cambios de backend en esta fase.

## ✅ Fase 7 — Vista del rol Encargado — **COMPLETADA**

- [x] **EncargadoView** (`/encargado`): "Mi albergue" (su albergue asignado) + sus residentes
- [x] Residentes scopeados por albergue (modo `restricted`: sin crear/eliminar)
- [x] Actualizar estado activo/inactivo → vía Editar del residente
- [x] Registrar/consultar historial → tab **Historial** en el detalle del residente
  (`ResidenteView` ahora tiene scope por albergue + tab Historial + columna **Persona**)

**RBAC real activado:**
- Redirect por rol al iniciar sesión (ENCARGADO → `/encargado`, ADMIN → `/dashboard`)
- Menú filtrado por rol (el encargado solo ve "Mi albergue" y "Mi perfil")
- Guard de rutas activado en `OutletContainer` (encargado → 401 en rutas de admin)
- Validado en navegador con ambos usuarios (admin y encargado1)

**Backend (LOCAL, sin commit) — bugs corregidos:**
- `UserService.create/update` no hasheaba el password → usuarios creados por la UI no podían
  loguearse. Ahora hashea con bcrypt.
- `UserService.update` borraba `role`/`albergue` (default de clase `= null` al guardar sin
  relaciones) → cualquier update de usuario le borraba el rol. Ahora carga relaciones.
- `residente` no cargaba `expediente.persona` → ahora sí (para mostrar el nombre).

> Todos los cambios de backend están consolidados en `CAMBIOS-BACKEND-PARA-PR.md` (en el repo
> del backend, local) para entregarlos como una sola PR al final.

## ✅ Fase 8 (bonus) — Tests E2E (Playwright) + 3 roles

- [x] **Playwright** configurado con grabación de video (`pnpm test:e2e`), `webServer` con
  `reuseExistingServer`, buenas prácticas (locators accesibles, web-first assertions, `test.step`).
- [x] **Specs**: `admin.spec` (recorrido completo), `encargado.spec` (mi albergue + RBAC + búsqueda),
  `superadmin.spec` (gestiona todos los usuarios). Los 3 pasan. Videos en `e2e-results/`.
- [x] **3 roles**: SUPER_ADMIN, ADMIN, ENCARGADO.
  - SUPER_ADMIN: acceso total, gestiona **todos** los usuarios.
  - ADMIN: todos los albergues, gestiona **solo** usuarios ENCARGADO (filtro + rol fijo en el alta).
  - ENCARGADO: solo su albergue.
  - Frontend listo (RBAC trata SUPER_ADMIN como acceso total); backend: rol SUPER_ADMIN sembrado (local).

## 🧩 Patrones reutilizables (documentados)

- **CRUD genérico** (`CrudView`): lista + form config-driven + búsqueda + filtros + soft-delete.
- **Relation managers** anidables (`relations` + `scopeParams`/`defaults`): tabs de hijas con CRUD
  scopeado al padre, hasta N niveles (validado a 3).
- **Búsqueda anidada** (helper `parseSearch` con rutas con punto, ej. `expediente.persona.nombres`):
  patrón disponible para cualquier controlador; aplicado **solo** en la tabla de residentes (que es
  donde tiene sentido buscar por el nombre de la persona).

---

## Grafo de dependencias (referencia)

```
ALBERGUE → HABITACION → ASIGNACION_HABITACION
ALBERGUE → RESIDENTE → (INGRESO, EGRESO, HORARIO, RESIDENTE_SERVICIO→SERVICIO)
PERSONA 1:1 EXPEDIENTE → (HISTORIAL, VALORACION, RESIDENTE)
PERSONA → (GRUPO_FAMILIAR, SIT_LABORAL, SIT_ACADEMICA, ECONOMIA, PERSONA_BENEFICIO→BENEFICIO)
ALBERGUE → RECIBO
```
