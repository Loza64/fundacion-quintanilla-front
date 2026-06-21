import { test, expect } from '@playwright/test'
import { login } from './helpers'

test('Encargado — mi albergue y RBAC', async ({ page }) => {
  await test.step('Iniciar sesión como encargado', async () => {
    await login(page, 'encargado1', 'encargado123')
    await expect(page).toHaveURL(/\/encargado/)
    await expect(page.getByText('Albergue Central')).toBeVisible()
  })

  await test.step('Ver residentes de mi albergue', async () => {
    await expect(page.getByText('Residentes de mi albergue')).toBeVisible()
    await expect(page.getByText('Juan Pérez')).toBeVisible()
  })

  await test.step('Búsqueda por nombre de persona', async () => {
    const search = page.getByPlaceholder('Buscar residente...')
    await search.fill('juan')
    await expect(page.getByText('Juan Pérez')).toBeVisible()
    await search.fill('zzz')
    await expect(page.getByText('Juan Pérez')).toBeHidden()
    await search.fill('')
    await expect(page.getByText('Juan Pérez')).toBeVisible()
  })

  await test.step('Detalle del residente con tab Historial', async () => {
    await page.getByRole('button', { name: 'Ver' }).first().click()
    await expect(page.getByRole('tab', { name: 'Historial' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Ingresos' })).toBeVisible()
    await page.keyboard.press('Escape')
  })

  await test.step('RBAC: sin acceso a rutas de admin', async () => {
    await page.goto('/dashboard')
    await expect(
      page.getByText('No tienes permiso para acceder a esta área')
    ).toBeVisible()
  })
})
