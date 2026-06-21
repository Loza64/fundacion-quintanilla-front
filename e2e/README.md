# Tests E2E (Playwright)

Tours end-to-end por rol, pensados como **demostraciones deterministas** de la
funcionalidad: login, navegación por todos los módulos, ver/buscar, crear, editar,
relation managers y RBAC. Selectores estables `data-testid` + roles accesibles.

## Cómo correrlos

```bash
pnpm test:e2e          # rápido, sin pausas (local / CI)
pnpm test:e2e:tour     # pausado y demostrativo (genera videos)
pnpm test:e2e:headed   # con navegador visible
pnpm test:e2e:report   # reporte HTML
```

Videos en `e2e-results/<test>/video.webm`. Ritmo configurable por env:
`E2E_SLOWMO` (slowMo por acción) y `E2E_PACE` (pausa en puntos clave); `test:e2e:tour`
los sube. En local/CI valen 0 → tests rápidos.

## Selectores `data-testid`

Los componentes CRUD reutilizables los exponen, así toda pantalla los hereda:

| testid | dónde |
|--------|-------|
| `login-username` / `login-password` / `login-submit` | login |
| `<entidad>-search` / `<entidad>-new` / `<entidad>-filters` | toolbar |
| `<entidad>-view-<id>` / `<entidad>-edit-<id>` / `<entidad>-delete-<id>` | acciones por fila |
| `<entidad>-filter-<campo>` | selects de filtro |
| `<entidad>-field-<campo>` / `<entidad>-form-submit` | formulario |

## Qué cubren los tours

| Spec | Recorrido |
|------|-----------|
| `superadmin.spec.ts` | Ve todos los usuarios → crear (eligiendo rol) → editar → buscar → Roles/Permisos → Albergues → catálogos (alta de servicio) → Personas → Expedientes → Residentes (búsqueda anidada + detalle) → Recibos → Reportes → Perfil |
| `admin.spec.ts` | Usuarios solo-encargados → crear/editar/buscar → Albergues → catálogos → Personas → Residentes → Reportes → Perfil |
| `encargado.spec.ts` | Su albergue → búsqueda por persona → detalle del residente → editar residente (escritura) → RBAC denegado → Perfil |

Los registros de prueba (`e2e_*`) se limpian por API en `afterEach` (`cleanupTestData`).

## Limitaciones conocidas de Ant Design

Dos interacciones quedan **fuera** de los tours por ser inestables por la naturaleza de
AntD (overlays en portales + reposicionamiento), no por Playwright:

- **Eliminar (Popconfirm)**: el botón de confirmación vive en un portal que anima y se
  reposiciona. Se valida a nivel de API/servicio.
- **Filtrar (Select dentro de Popover)**: el dropdown en portal cierra el popover o entra
  en loop de re-render. El tour solo abre el panel de filtros.

Todo lo demás (modales, drawers, tabs, búsqueda) es estable con el auto-wait de Playwright.
