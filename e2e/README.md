# Tests E2E (Playwright)

Tours end-to-end del frontend, siguiendo buenas prácticas de Playwright:
selectores estables `data-testid` (`getByTestId`) en los componentes reutilizables,
web-first assertions (con auto-retry), `test.step` para legibilidad y narración del video,
y espera de respuestas de red en vez de timeouts fijos.

## Cómo correrlos

```bash
pnpm test:e2e          # rápido, sin pausas (local / CI)
pnpm test:e2e:tour     # pausado y demostrativo (genera videos lentos)
pnpm test:e2e:headed   # con navegador visible
pnpm test:e2e:report   # abre el reporte HTML
```

Los videos quedan en `e2e-results/<nombre-del-test>/video.webm`.

## Ritmo configurable (mismo test, video o CI)

El ritmo entre acciones se controla por variables de entorno, así el **mismo** test sirve
para grabar videos pausados y para correr rápido en CI:

| Var | Efecto | Default |
|-----|--------|---------|
| `E2E_SLOWMO` | `slowMo` de Playwright: retarda cada acción N ms | `0` |
| `E2E_PACE` | pausa extra en puntos clave del recorrido (`beat()` en `helpers.ts`) | `0` |

`pnpm test:e2e:tour` define `E2E_SLOWMO=400 E2E_PACE=1100`. En local/CI ambos valen `0`.

## Selectores `data-testid`

Los componentes CRUD reutilizables exponen testids estables, así toda pantalla los hereda:

| testid | dónde |
|--------|-------|
| `login-username` / `login-password` / `login-submit` | login |
| `<entidad>-search` / `<entidad>-new` / `<entidad>-filters` | toolbar de cada CRUD |
| `<entidad>-view-<id>` / `<entidad>-edit-<id>` / `<entidad>-delete-<id>` | acciones por fila |
| `<entidad>-delete-confirm` | confirmación de borrado |
| `<entidad>-field-<campo>` | inputs del formulario |
| `<entidad>-form-submit` / `<entidad>-form-cancel` | guardar / cancelar del modal |

`<entidad>` deriva del `label` del CRUD (o de la prop `testId`).

## Prerequisitos

- **Backend** corriendo en `http://localhost:4000` (repo `fundacion-quintanilla-back`).
- **Frontend**: Playwright lo levanta solo (`webServer` con `reuseExistingServer`) en `:5180`.
- **Datos sembrados** que esperan los tours:
  - Usuarios: `admin` / `admin123` (ADMIN), `encargado1` / `encargado123` (ENCARGADO),
    `superadmin` / `superadmin123` (SUPER ADMIN).
  - `encargado1` asignado a un albergue ("Albergue Central") con al menos un residente
    (Juan Pérez).

## Tours

| Spec | Qué demuestra |
|------|----------------|
| `admin.spec.ts` | Login admin → usuarios (solo encargados) → **alta + baja real** de un encargado → albergues (relation managers) → personas (sub-fichas) → residentes (búsqueda anidada) → reportes |
| `encargado.spec.ts` | Login encargado → su albergue + residentes → búsqueda por persona → detalle con historial → RBAC (sin acceso a rutas de admin) |
| `superadmin.spec.ts` | El super admin ve y gestiona TODOS los usuarios y puede elegir el rol al crear |

## Roles (RBAC)

- **SUPER ADMIN**: acceso total; gestiona todos los usuarios. (El backend lo identifica por
  nombre en el guard, con acceso absoluto.)
- **ADMIN**: acceso a todos los albergues; gestiona solo usuarios ENCARGADO.
- **ENCARGADO**: solo su albergue asignado y sus residentes.
