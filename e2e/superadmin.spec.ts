import { test, expect } from '@playwright/test'
import { login, beat } from './helpers'

test('Tour Super Admin — gestiona todos los usuarios y roles', async ({
  page,
}) => {
  await test.step('Iniciar sesión como super admin', async () => {
    await login(page, 'superadmin', 'superadmin123')
    await expect(page).toHaveURL(/\/dashboard/)
  })

  await test.step('Ve TODOS los usuarios (admin, encargado y super admin)', async () => {
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
    await beat(page)
  })

  await test.step('Al crear, el super admin puede elegir el ROL', async () => {
    await page.getByTestId('usuario-new').click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(
      page.getByRole('dialog').getByText('Rol', { exact: true })
    ).toBeVisible()
    await expect(page.getByTestId('usuario-field-role')).toBeVisible()
    await beat(page)
    await page.getByTestId('usuario-form-cancel').click()
  })

  await test.step('Acceso total: también ve los albergues', async () => {
    await page.goto('/albergues')
    await expect(page.getByText('Albergue Central')).toBeVisible()
    await beat(page)
  })
})
