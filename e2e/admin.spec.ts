import { test, expect } from '@playwright/test'
import { login, beat, go, openFirstDetail, cleanupTestData } from './helpers'

test.afterEach(async ({ request }) => {
  await cleanupTestData(request)
})

test('Tour Admin — funcionalidad completa', async ({ page }) => {
  const sfx = Date.now().toString().slice(-6)
  const username = `e2e_adm_${sfx}`

  await test.step('Iniciar sesión como administrador', async () => {
    await login(page, 'admin', 'admin123')
    await expect(page).toHaveURL(/\/dashboard/)
  })

  await test.step('Usuarios: el admin solo gestiona ENCARGADOS', async () => {
    await expect(page.getByText('encargado1')).toBeVisible()
    await expect(
      page.getByRole('cell', { name: 'admin@fundacion.local', exact: true })
    ).toBeHidden()
    await beat(page)
  })

  await test.step('Usuarios: crear un encargado', async () => {
    await page.getByTestId('usuario-new').click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByTestId('usuario-field-username').fill(username)
    await page.getByTestId('usuario-field-name').fill('Encargado')
    await page.getByTestId('usuario-field-surname').fill('Nuevo')
    await page
      .getByTestId('usuario-field-email')
      .fill(`${username}@fundacion.local`)
    await page.getByTestId('usuario-field-password').fill('prueba123')
    await page.getByTestId('usuario-form-submit').click()
    await expect(
      page.getByRole('cell', { name: username, exact: true })
    ).toBeVisible()
    await beat(page)
  })

  await test.step('Usuarios: editar el encargado', async () => {
    const row = page.getByRole('row', { name: new RegExp(username) })
    await row.getByRole('button', { name: 'Editar' }).click()
    await page.getByTestId('usuario-field-surname').fill(`Editado-${sfx}`)
    await page.getByTestId('usuario-form-submit').click()
    await expect(
      page.getByRole('cell', { name: `Editado-${sfx}`, exact: true })
    ).toBeVisible()
    await beat(page)
  })

  await test.step('Usuarios: buscar al encargado creado', async () => {
    await page.getByTestId('usuario-search').fill(username)
    await expect(
      page.getByRole('cell', { name: username, exact: true })
    ).toBeVisible()
    await beat(page)
    await page.getByTestId('usuario-search').fill('')
    await beat(page)
  })

  await test.step('Albergues: relation managers (habitaciones + recibos)', async () => {
    await go(page, '/albergues')
    await expect(page.getByText('Albergue Central')).toBeVisible()
    await openFirstDetail(page, ['Habitaciones', 'Recibos'])
    await page.getByRole('tab', { name: 'Habitaciones' }).click()
    await expect(
      page.getByRole('tabpanel').getByRole('button', { name: 'Nuevo' })
    ).toBeVisible()
    await beat(page)
    await page.keyboard.press('Escape')
  })

  await test.step('Catálogos: habitaciones y CRUD de servicio', async () => {
    await go(page, '/habitaciones')
    await expect(page.getByRole('table')).toBeVisible()
    await go(page, '/servicios')
    const servicio = `e2e_srv_${sfx}`
    await page.getByTestId('servicio-new').click()
    await page.getByTestId('servicio-field-nombre').fill(servicio)
    await page.getByTestId('servicio-form-submit').click()
    await expect(
      page.getByRole('cell', { name: servicio, exact: true })
    ).toBeVisible()
    await beat(page)
  })

  await test.step('Personas: expediente y sub-fichas anidadas', async () => {
    await go(page, '/personas')
    await expect(
      page.getByRole('cell', { name: 'Pérez', exact: true })
    ).toBeVisible()
    await openFirstDetail(page, ['Expediente', 'Grupo familiar', 'Economía'])
    await page.keyboard.press('Escape')
  })

  await test.step('Residentes: búsqueda anidada por nombre de persona', async () => {
    await go(page, '/residentes')
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

  await test.step('Reportes y Perfil', async () => {
    await go(page, '/reportes')
    await expect(page.getByText('Residentes activos')).toBeVisible()
    await go(page, '/perfil')
    await expect(page.getByLabel('Usuario')).toHaveValue('admin')
    await beat(page)
  })
})
