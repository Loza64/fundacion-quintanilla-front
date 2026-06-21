import { test, expect } from '@playwright/test'
import { login, beat, go } from './helpers'

test('Tour Encargado — su albergue, residentes y RBAC', async ({ page }) => {
  await test.step('Iniciar sesión como encargado', async () => {
    await login(page, 'encargado1', 'encargado123')
    await expect(page).toHaveURL(/\/encargado/)
    await expect(page.getByText('Albergue Central')).toBeVisible()
  })

  await test.step('Ver solo los residentes de mi albergue', async () => {
    await expect(page.getByText('Residentes de mi albergue')).toBeVisible()
    await expect(page.getByText('Juan Pérez')).toBeVisible()
    await beat(page)
  })

  await test.step('Buscar un residente por nombre de la persona', async () => {
    const search = page.getByTestId('residente-search')
    await search.fill('juan')
    await expect(page.getByText('Juan Pérez')).toBeVisible()
    await beat(page)
    await search.fill('zzz')
    await expect(page.getByText('Juan Pérez')).toBeHidden()
    await search.fill('')
    await expect(page.getByText('Juan Pérez')).toBeVisible()
    await beat(page)
  })

  await test.step('Detalle del residente y sus fichas', async () => {
    await page.getByRole('button', { name: 'Ver' }).first().click()
    for (const tab of ['Historial', 'Ingresos', 'Egresos', 'Servicios']) {
      await expect(page.getByRole('tab', { name: tab })).toBeVisible()
    }
    await page.getByRole('tab', { name: 'Ingresos' }).click()
    await beat(page)
    await page.getByRole('tab', { name: 'Servicios' }).click()
    await beat(page)
    await page.keyboard.press('Escape')
  })

  await test.step('Editar un residente (permiso de escritura del encargado)', async () => {
    await page.getByRole('button', { name: 'Editar' }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page
      .getByTestId('residente-field-motivo_ingreso')
      .fill('Actualizado por el encargado en el tour E2E')
    await page.getByTestId('residente-form-submit').click()
    await expect(page.getByRole('dialog')).toBeHidden()
    await beat(page)
  })

  await test.step('RBAC: el encargado no entra a rutas de admin', async () => {
    await go(page, '/dashboard')
    await expect(
      page.getByText('No tienes permiso para acceder a esta área')
    ).toBeVisible()
    await beat(page)
  })

  await test.step('Cierre en su perfil', async () => {
    await go(page, '/perfil')
    await expect(page.getByLabel('Usuario')).toHaveValue('encargado1')
    await beat(page)
  })
})
