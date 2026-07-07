import { test, expect } from '@playwright/test'
import {
  login,
  beat,
  go,
  pickOption,
  openFirstDetail,
  cleanupTestData,
} from './helpers'

test.afterEach(async ({ request }) => {
  await cleanupTestData(request)
})

test('Tour Super Admin — funcionalidad completa', async ({ page }) => {
  const sfx = Date.now().toString().slice(-6)
  const username = `e2e_sa_${sfx}`

  await test.step('Iniciar sesión como super admin', async () => {
    await login(page, 'superadmin', 'superadmin123')
    await expect(page).toHaveURL(/\/dashboard/)
  })

  await test.step('Usuarios: ve TODOS los roles', async () => {
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

  await test.step('Usuarios: panel de filtros', async () => {
    await page.getByTestId('usuario-filters').click()
    await expect(page.getByTestId('usuario-filter-role')).toBeVisible()
    await expect(page.getByTestId('usuario-filter-blocked')).toBeVisible()
    await beat(page)
    await page.keyboard.press('Escape')
  })

  await test.step('Usuarios: crear (eligiendo rol)', async () => {
    await page.getByTestId('usuario-new').click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByTestId('usuario-field-username').fill(username)
    await page.getByTestId('usuario-field-name').fill('Test')
    await page.getByTestId('usuario-field-surname').fill('Super')
    await page
      .getByTestId('usuario-field-email')
      .fill(`${username}@fundacion.local`)
    await page.getByTestId('usuario-field-password').fill('prueba123')
    await pickOption(page, 'usuario-field-role', 'ENCARGADO')
    await page.getByTestId('usuario-form-submit').click()
    await expect(
      page.getByRole('cell', { name: username, exact: true })
    ).toBeVisible()
    await beat(page)
  })

  await test.step('Usuarios: editar el usuario creado', async () => {
    const row = page.getByRole('row', { name: new RegExp(username) })
    await row.getByRole('button', { name: 'Editar' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByTestId('usuario-field-surname').fill(`Editado-${sfx}`)
    await page.getByTestId('usuario-form-submit').click()
    await expect(
      page.getByRole('cell', { name: `Editado-${sfx}`, exact: true })
    ).toBeVisible()
    await beat(page)
  })

  await test.step('Usuarios: buscar al usuario creado', async () => {
    await page.getByTestId('usuario-search').fill(username)
    await expect(
      page.getByRole('cell', { name: username, exact: true })
    ).toBeVisible()
    await beat(page)
    await page.getByTestId('usuario-search').fill('')
    await beat(page)
  })

  await test.step('Roles y Permisos', async () => {
    await go(page, '/roles')
    await expect(page.getByRole('table')).toBeVisible()
    await expect(page.getByText('ENCARGADO').first()).toBeVisible()
    await go(page, '/permisos')
    await expect(page.getByRole('table')).toBeVisible()
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

  await test.step('Catálogos: habitaciones, beneficios y CRUD de servicio', async () => {
    await go(page, '/habitaciones')
    await expect(page.getByRole('table')).toBeVisible()
    await go(page, '/beneficios')
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

  await test.step('Personas: sub-fichas anidadas', async () => {
    await go(page, '/personas')
    await expect(
      page.getByRole('cell', { name: 'Pérez', exact: true })
    ).toBeVisible()
    await openFirstDetail(page, ['Expediente', 'Grupo familiar', 'Economía'])
    await page.getByRole('tab', { name: 'Economía' }).click()
    await beat(page)
    await page.keyboard.press('Escape')
  })

  await test.step('Expedientes y Residentes (búsqueda anidada + detalle)', async () => {
    await go(page, '/expedientes')
    await expect(page.getByRole('table')).toBeVisible()
    await go(page, '/residentes')
    await page.getByTestId('residente-search').fill('juan')
    await expect(page.getByText('Juan Pérez')).toBeVisible()
    await openFirstDetail(page, [
      'Historial',
      'Ingresos',
      'Egresos',
      'Servicios',
    ])
    await page.keyboard.press('Escape')
    await page.getByTestId('residente-search').fill('')
    await beat(page)
  })

  await test.step('Recibos, Reportes y Perfil', async () => {
    await go(page, '/recibos')
    await expect(page.getByRole('table')).toBeVisible()
    await go(page, '/reportes')
    await expect(page.getByText('Residentes activos')).toBeVisible()
    await go(page, '/perfil')
    await expect(page.getByLabel('Usuario')).toHaveValue('superadmin')
    await beat(page)
  })
})
