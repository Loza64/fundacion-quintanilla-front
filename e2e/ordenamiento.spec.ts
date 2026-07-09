import { test, expect } from '@playwright/test'
import { login, beat, go } from './helpers'

const idsColumna = async (page: import('@playwright/test').Page) =>
  page.locator('tbody tr.ant-table-row td:first-child').allInnerTexts()

test('Ordenamiento de tablas: estable por defecto y clickeable por columna', async ({
  page,
}) => {
  await test.step('Iniciar sesión', async () => {
    await login(page, 'superadmin', 'superadmin123')
  })

  await test.step('Personas: orden estable ascendente por defecto', async () => {
    await go(page, '/personas')
    await expect(page.locator('tbody tr.ant-table-row').first()).toBeVisible()
    const ids = (await idsColumna(page)).map(Number)
    const ordenado = [...ids].sort((a, b) => a - b)
    expect(ids).toEqual(ordenado)
  })

  await test.step('Editar una persona no la manda al final', async () => {
    const idsAntes = await idsColumna(page)
    const primeraFila = page.locator('tbody tr.ant-table-row').first()
    await primeraFila.getByRole('button', { name: 'Editar' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByTestId('persona-field-nombres').fill('EditadoOrden')
    await page.getByTestId('persona-form-submit').click()
    await expect(page.getByText('persona actualizado')).toBeVisible()
    await beat(page)
    const idsDespues = await idsColumna(page)
    expect(idsDespues).toEqual(idsAntes)
  })

  await test.step('La columna Nombre es ordenable (server-side)', async () => {
    const header = page.getByRole('columnheader', { name: 'Nombres' })
    await expect(header).toBeVisible()
    await header.click()
    await beat(page)
    const nombres = await page
      .locator('tbody tr.ant-table-row td:nth-child(3)')
      .allInnerTexts()
    const ordenado = [...nombres].sort((a, b) => a.localeCompare(b, 'es'))
    expect(nombres).toEqual(ordenado)
  })
})
