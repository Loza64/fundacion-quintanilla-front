import { test, expect } from '@playwright/test'
import { login, beat } from './helpers'

test('Tour Admin — gestión global, CRUD y mantenimientos anidados', async ({
  page,
}) => {
  const suffix = Date.now().toString().slice(-6)
  const username = `e2e_enc_${suffix}`

  await test.step('Iniciar sesión como administrador', async () => {
    await login(page, 'admin', 'admin123')
    await expect(page).toHaveURL(/\/dashboard/)
  })

  await test.step('Usuarios: el admin solo gestiona ENCARGADOS', async () => {
    await expect(page.getByTestId('usuario-new')).toBeVisible()
    await expect(page.getByText('encargado1')).toBeVisible()
    await expect(
      page.getByRole('cell', { name: 'admin@fundacion.local', exact: true })
    ).toBeHidden()
    await beat(page)
  })

  await test.step('Crear un nuevo encargado (alta + hash de contraseña)', async () => {
    await page.getByTestId('usuario-new').click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByTestId('usuario-field-username').fill(username)
    await page.getByTestId('usuario-field-name').fill('Encargado')
    await page.getByTestId('usuario-field-surname').fill('De Prueba')
    await page
      .getByTestId('usuario-field-email')
      .fill(`${username}@fundacion.local`)
    await page.getByTestId('usuario-field-password').fill('prueba123')
    await beat(page)
    await page.getByTestId('usuario-form-submit').click()
    await expect(
      page.getByRole('cell', { name: username, exact: true })
    ).toBeVisible()
    await beat(page)
  })

  await test.step('Eliminar el usuario de prueba (limpieza)', async () => {
    const row = page.getByRole('row', { name: new RegExp(username) })
    await row.getByRole('button', { name: 'Eliminar' }).click()
    await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes('/soft-delete') &&
          res.request().method() === 'PATCH'
      ),
      page.getByTestId('usuario-delete-confirm').click(),
    ])
    await beat(page)
    await page.reload()
    await expect(
      page.getByRole('cell', { name: username, exact: true })
    ).toBeHidden()
    await beat(page)
  })

  await test.step('Albergues: relation managers (habitaciones y recibos)', async () => {
    await page.goto('/albergues')
    await expect(page.getByText('Albergue Central')).toBeVisible()
    await page.getByRole('button', { name: 'Ver' }).first().click()
    await expect(page.getByRole('tab', { name: 'Habitaciones' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Recibos' })).toBeVisible()
    await page.getByRole('tab', { name: 'Habitaciones' }).click()
    await expect(
      page.getByRole('tabpanel').getByRole('button', { name: 'Nuevo' })
    ).toBeVisible()
    await beat(page)
    await page.keyboard.press('Escape')
  })

  await test.step('Personas: expediente y sub-fichas anidadas', async () => {
    await page.goto('/personas')
    await expect(
      page.getByRole('cell', { name: 'Pérez', exact: true })
    ).toBeVisible()
    await page.getByRole('button', { name: 'Ver' }).first().click()
    await expect(page.getByRole('tab', { name: 'Expediente' })).toBeVisible()
    await expect(
      page.getByRole('tab', { name: 'Grupo familiar' })
    ).toBeVisible()
    await beat(page)
    await page.keyboard.press('Escape')
  })

  await test.step('Residentes: búsqueda anidada por nombre de persona', async () => {
    await page.goto('/residentes')
    const search = page.getByTestId('residente-search')
    await expect(page.getByText('Juan Pérez')).toBeVisible()
    await search.fill('juan')
    await expect(page.getByText('Juan Pérez')).toBeVisible()
    await beat(page)
    await search.fill('zzz')
    await expect(page.getByText('Juan Pérez')).toBeHidden()
    await search.fill('')
    await beat(page)
  })

  await test.step('Reportes: estadísticas globales', async () => {
    await page.goto('/reportes')
    await expect(page.getByText('Residentes activos')).toBeVisible()
    await beat(page)
  })
})
