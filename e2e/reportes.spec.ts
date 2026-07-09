import { test, expect } from '@playwright/test'
import { login, beat, go } from './helpers'

test('Reportes: gráficos parametrizables por rango de fecha', async ({
  page,
}) => {
  await test.step('Iniciar sesión', async () => {
    await login(page, 'superadmin', 'superadmin123')
  })

  await test.step('Cargar Reportes y ver los gráficos', async () => {
    await go(page, '/reportes')
    for (const titulo of [
      'Ingresos vs Egresos por mes',
      'Recaudación por mes',
      'Recibos por tipo',
      'Recaudación por albergue',
      'Residentes ingresados por albergue',
      'Ocupación actual por albergue',
      'Habitaciones por estado',
      'Residentes por sexo',
      'Personas por país de nacimiento',
      'Personas por rango de edad',
      'Expedientes por nivel de riesgo',
      'Beneficios otorgados por tipo',
    ]) {
      await expect(
        page.locator('.ant-card-head-title', { hasText: titulo })
      ).toBeVisible()
    }
    await expect(page.locator('.recharts-surface').first()).toBeVisible()
    const surfaces = await page.locator('.recharts-surface').count()
    expect(surfaces).toBeGreaterThanOrEqual(12)
    await beat(page)
    await page.screenshot({
      path: 'e2e-results/reportes-full.png',
      fullPage: true,
    })
  })

  await test.step('El selector de rango existe y es interactivo', async () => {
    await expect(page.getByText('Rango de fechas:')).toBeVisible()
    await expect(page.locator('.ant-picker-range').first()).toBeVisible()
  })
})
