import { test, expect } from '@playwright/test'
import { login, beat, go } from './helpers'

test('SUPER ADMIN ve Nuevo y Eliminar en "Mi albergue"', async ({ page }) => {
  await login(page, 'superadmin', 'superadmin123')
  await go(page, '/encargado')
  await expect(page.getByText('Residentes de mi albergue')).toBeVisible()
  await expect(page.locator('tbody tr.ant-table-row').first()).toBeVisible()
  const fila = page.locator('tbody tr.ant-table-row').first()
  await expect(fila.getByRole('button', { name: 'Eliminar' })).toBeVisible()
  await expect(page.getByTestId('residente-new')).toBeVisible()
  await beat(page)
})

test('SUPER ADMIN ve Nuevo y Eliminar en Usuarios', async ({ page }) => {
  await login(page, 'superadmin', 'superadmin123')
  await go(page, '/dashboard')
  await expect(page.locator('tbody tr.ant-table-row').first()).toBeVisible()
  await expect(page.getByTestId('usuario-new')).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Eliminar' }).first()
  ).toBeVisible()
})

test('ADMIN sin permiso de crear/eliminar NO ve Nuevo ni Eliminar', async ({
  page,
}) => {
  await login(page, 'admin.limitado', 'pass1234')
  await go(page, '/dashboard')
  await expect(page.locator('tbody tr.ant-table-row').first()).toBeVisible()
  await expect(page.getByTestId('usuario-new')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Eliminar' })).toHaveCount(0)
  // sí puede editar (tiene PUT)
  await expect(
    page.getByRole('button', { name: 'Editar' }).first()
  ).toBeVisible()
})
