import { test, expect } from '@playwright/test'
import { login, beat, go } from './helpers'

const idsColumna = async (page: import('@playwright/test').Page) =>
  (
    await page.locator('tbody tr.ant-table-row td:first-child').allInnerTexts()
  ).map(Number)

test('Ordenamiento de tablas: estable y ordenamiento ascendente/descendente por columna', async ({
  page,
}) => {
  await test.step('Iniciar sesión', async () => {
    await login(page, 'superadmin', 'superadmin123')
  })

  await test.step('Usuarios: orden estable ascendente por defecto', async () => {
    await go(page, '/dashboard')
    await expect(page.locator('tbody tr.ant-table-row').first()).toBeVisible()
    const ids = await idsColumna(page)
    expect(ids).toEqual([...ids].sort((a, b) => a - b))
  })

  await test.step('Ordenar por columna ID descendente sí funciona', async () => {
    const header = page.getByRole('columnheader', { name: 'ID', exact: true })
    await header.click() // ascendente
    await beat(page)
    await header.click() // descendente
    await beat(page)
    const ids = await idsColumna(page)
    expect(ids).toEqual([...ids].sort((a, b) => b - a))
    expect(ids[0]).toBeGreaterThan(ids[ids.length - 1])
  })

  await test.step('Volver a ascendente por columna ID', async () => {
    const header = page.getByRole('columnheader', { name: 'ID', exact: true })
    await header.click()
    await beat(page)
    const ids = await idsColumna(page)
    expect(ids).toEqual([...ids].sort((a, b) => a - b))
  })
})
