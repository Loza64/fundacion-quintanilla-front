import { test, expect } from '@playwright/test'
import { login, beat, go } from './helpers'

test('Roles: no se crean y el nombre no es editable', async ({ page }) => {
  await test.step('Iniciar sesión (super admin)', async () => {
    await login(page, 'superadmin', 'superadmin123')
  })

  await test.step('No existe el botón "Nuevo"', async () => {
    await go(page, '/roles')
    await expect(page.locator('tbody tr.ant-table-row').first()).toBeVisible()
    await expect(page.getByTestId('rol-new')).toHaveCount(0)
  })

  await test.step('El nombre está deshabilitado y se puede editar el resto', async () => {
    const fila = page
      .locator('tbody tr.ant-table-row')
      .filter({ has: page.getByRole('cell', { name: 'ADMIN', exact: true }) })
    await fila.getByRole('button', { name: 'Editar' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByTestId('rol-field-name')).toBeDisabled()
    // editar el switch "Activo" y guardar no debe dar error
    await page.getByTestId('rol-field-active').click()
    await page.getByTestId('rol-form-submit').click()
    await expect(page.getByText('rol actualizado')).toBeVisible()
    await beat(page)
  })
})
