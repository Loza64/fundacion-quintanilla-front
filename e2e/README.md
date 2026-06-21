# Tests E2E (Playwright)

Tests end-to-end del frontend, siguiendo buenas prácticas de Playwright:
locators accesibles (`getByRole`/`getByPlaceholder`/`getByText`), web-first assertions
(con auto-retry), `test.step` para legibilidad y narración del video, sin `waitForTimeout`.

## Cómo correrlos

```bash
pnpm test:e2e          # corre los 3 specs (genera video por test)
pnpm test:e2e:headed   # con navegador visible
pnpm test:e2e:report   # abre el reporte HTML
```

Los videos quedan en `e2e-results/<nombre-del-test>/video.webm`.

## Prerequisitos

- **Backend** corriendo en `http://localhost:4000` (repo `fundacion-quintanilla-back`).
- **Frontend**: Playwright lo levanta solo (`webServer` con `reuseExistingServer`), o usa el
  `pnpm dev` que ya esté corriendo en `:5180`.
- **Datos sembrados** que esperan los tests:
  - Usuarios: `admin` / `admin123` (ADMIN), `encargado1` / `encargado123` (ENCARGADO),
    `superadmin` / `superadmin123` (SUPER_ADMIN).
  - El encargado1 asignado a un albergue ("Albergue Central") con al menos un residente.

## Specs

| Spec | Qué valida |
|------|------------|
| `admin.spec.ts` | Login admin → usuarios (solo encargados) → albergues (relation managers) → personas (sub-fichas) → residentes (búsqueda anidada) → reportes |
| `encargado.spec.ts` | Login encargado → su albergue + residentes → búsqueda por persona → detalle con historial → RBAC (401 en rutas de admin) |
| `superadmin.spec.ts` | El super admin ve y gestiona TODOS los usuarios |

## Roles (RBAC)

- **SUPER_ADMIN**: acceso total; gestiona todos los usuarios.
- **ADMIN**: acceso a todos los albergues; gestiona solo usuarios ENCARGADO.
- **ENCARGADO**: solo su albergue asignado y sus residentes.
