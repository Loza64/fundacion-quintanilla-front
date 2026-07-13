import { test, expect } from '@playwright/test'
import { login, go } from './helpers'

// El toggle "Ver eliminados" solo debe verse si el usuario tiene permiso de
// soft-delete/restore del recurso. (El segundo caso requiere admin.limitado:
// rol ADMIN con GET/PUT de users pero sin soft-delete/restore.)

test('SUPER ADMIN sí ve "Ver eliminados"', async ({ page }) => {
  await login(page, 'superadmin', 'superadmin123')
  await go(page, '/dashboard')
  await expect(page.locator('tbody tr.ant-table-row').first()).toBeVisible()
  await expect(page.getByTestId('usuario-toggle-deleted')).toBeVisible()
})

test('ADMIN sin permiso de eliminar NO ve "Ver eliminados"', async ({
  page,
}) => {
  await login(page, 'admin.limitado', 'pass1234')
  await go(page, '/dashboard')
  await expect(page.locator('tbody tr.ant-table-row').first()).toBeVisible()
  await expect(page.getByTestId('usuario-toggle-deleted')).toHaveCount(0)
})
