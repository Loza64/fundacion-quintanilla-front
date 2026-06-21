import { test, expect } from '@playwright/test'
import { login, beat } from './helpers'

test('Tour Encargado — su albergue, búsqueda y RBAC', async ({ page }) => {
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

  await test.step('Abrir el detalle del residente (historial e ingresos)', async () => {
    await page.getByRole('button', { name: 'Ver' }).first().click()
    await expect(page.getByRole('tab', { name: 'Historial' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Ingresos' })).toBeVisible()
    await page.getByRole('tab', { name: 'Historial' }).click()
    await beat(page)
    await page.keyboard.press('Escape')
  })

  await test.step('RBAC: el encargado no entra a rutas de admin', async () => {
    await page.goto('/dashboard')
    await expect(
      page.getByText('No tienes permiso para acceder a esta área')
    ).toBeVisible()
    await beat(page)
  })
})
