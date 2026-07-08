import { test, expect } from '@playwright/test'
import { login, beat, go } from './helpers'

// Tour de soft-delete: crear → eliminar (soft) → "Ver eliminados" → restaurar.
test('Tour Soft-delete + Restaurar', async ({ page }) => {
  const sfx = Date.now().toString().slice(-6)
  const nombre = `e2e_sd_${sfx}`

  await test.step('Iniciar sesión', async () => {
    await login(page, 'superadmin', 'superadmin123')
  })

  await test.step('Crear un servicio', async () => {
    await go(page, '/servicios')
    await page.getByTestId('servicio-new').click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByTestId('servicio-field-nombre').fill(nombre)
    await page.getByTestId('servicio-form-submit').click()
    await expect(
      page.getByRole('cell', { name: nombre, exact: true })
    ).toBeVisible()
  })

  await test.step('Eliminar (soft) el servicio', async () => {
    const row = page.getByRole('row', { name: new RegExp(nombre) })
    await row.getByRole('button', { name: 'Eliminar' }).click()
    await page.getByTestId('servicio-delete-confirm').click()
    await expect(page.getByText('servicio eliminado')).toBeVisible()
    await expect(
      page.getByRole('cell', { name: nombre, exact: true })
    ).toBeHidden()
    await beat(page)
  })

  await test.step('"Ver eliminados": el servicio aparece', async () => {
    await page.getByTestId('servicio-toggle-deleted').click()
    await expect(
      page.getByRole('cell', { name: nombre, exact: true })
    ).toBeVisible()
    await beat(page)
  })

  await test.step('Restaurar el servicio', async () => {
    const row = page.getByRole('row', { name: new RegExp(nombre) })
    await row.getByRole('button', { name: 'Restaurar' }).click()
    await page.getByTestId('servicio-restore-confirm').click()
    await expect(page.getByText('servicio restaurado')).toBeVisible()
    await beat(page)
  })

  await test.step('"Ver activos": el servicio volvió', async () => {
    await page.getByTestId('servicio-toggle-deleted').click()
    await expect(
      page.getByRole('cell', { name: nombre, exact: true })
    ).toBeVisible()
    await beat(page)
  })
})
