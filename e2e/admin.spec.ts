import { test, expect } from '@playwright/test'
import { login } from './helpers'

test('Admin — gestión y navegación', async ({ page }) => {
  await test.step('Iniciar sesión como admin', async () => {
    await login(page, 'admin', 'admin123')
    await expect(page).toHaveURL(/\/dashboard/)
  })

  await test.step('Usuarios (el admin gestiona solo encargados)', async () => {
    await expect(page.getByText('encargado1')).toBeVisible()
    await expect(page.getByText('maria@fundacion.local')).toBeVisible()
    // el admin NO se ve a sí mismo ni a otros admins (solo encargados)
    await expect(
      page.getByRole('cell', { name: 'admin@fundacion.local', exact: true })
    ).toBeHidden()
  })

  await test.step('Albergues → detalle con habitaciones y recibos', async () => {
    await page.goto('/albergues')
    await expect(page.getByText('Albergue Central')).toBeVisible()
    await page.getByRole('button', { name: 'Ver' }).first().click()
    await expect(page.getByRole('tab', { name: 'Habitaciones' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Recibos' })).toBeVisible()
    await page.keyboard.press('Escape')
  })

  await test.step('Personas → expediente y sub-fichas', async () => {
    await page.goto('/personas')
    await expect(
      page.getByRole('cell', { name: 'Pérez', exact: true })
    ).toBeVisible()
    await page.getByRole('button', { name: 'Ver' }).first().click()
    await expect(page.getByRole('tab', { name: 'Expediente' })).toBeVisible()
    await expect(
      page.getByRole('tab', { name: 'Grupo familiar' })
    ).toBeVisible()
    await page.keyboard.press('Escape')
  })

  await test.step('Residentes → búsqueda por nombre de persona', async () => {
    await page.goto('/residentes')
    await page.getByPlaceholder('Buscar residente...').fill('juan')
    await expect(page.getByText('Juan Pérez')).toBeVisible()
  })

  await test.step('Reportes → estadísticas', async () => {
    await page.goto('/reportes')
    await expect(page.getByText('Residentes activos')).toBeVisible()
  })
})
