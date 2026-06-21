import { test, expect } from '@playwright/test'
import { login } from './helpers'

test('Super admin — gestiona todos los usuarios', async ({ page }) => {
  await test.step('Iniciar sesión como super admin', async () => {
    await login(page, 'superadmin', 'superadmin123')
    await expect(page).toHaveURL(/\/dashboard/)
  })

  await test.step('Ve TODOS los usuarios (admin, encargado, super admin)', async () => {
    await expect(
      page.getByRole('cell', { name: 'admin@fundacion.local', exact: true })
    ).toBeVisible()
    await expect(page.getByText('encargado1')).toBeVisible()
    await expect(
      page.getByRole('cell', {
        name: 'superadmin@fundacion.local',
        exact: true,
      })
    ).toBeVisible()
  })
})
