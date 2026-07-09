import { test, expect } from '@playwright/test'
import { login, beat, go } from './helpers'

// Nota: los inputs de rango de AntD (RangePicker / InputNumber) viven en portales
// y AntD los saca/reposiciona en el DOM, igual que los Select dentro de Popover.
// El tour cubre lo estable (presencia + filtrado de precio); el resto se valida por API.
test('Filtros de fecha/precio y relaciones', async ({ page }) => {
  await test.step('Iniciar sesión', async () => {
    await login(page, 'superadmin', 'superadmin123')
  })

  await test.step('Servicios: filtro por precio deja la tabla vacía', async () => {
    await go(page, '/servicios')
    await expect(page.locator('tbody tr.ant-table-row').first()).toBeVisible()
    const min = page.getByRole('spinbutton', { name: 'Precio mín' })
    await expect(min).toBeVisible()
    await expect(
      page.getByRole('spinbutton', { name: 'Precio máx' })
    ).toBeVisible()
    await min.fill('999999')
    await beat(page)
    await expect(page.locator('tbody tr.ant-table-row')).toHaveCount(0)
  })

  await test.step('Recibos: el filtro de rango de fecha está presente', async () => {
    await go(page, '/recibos')
    await expect(page.getByPlaceholder('Desde')).toBeVisible()
    await expect(page.getByPlaceholder('Hasta')).toBeVisible()
    await beat(page)
  })
})
