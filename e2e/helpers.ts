import { expect, type Page } from '@playwright/test'

// Pausa global entre acciones (ms). 0 en local/CI = tests rápidos;
// `pnpm test:e2e:tour` la sube para grabar videos demostrativos pausados.
export const PACE = Number(process.env.E2E_PACE ?? 0)

export async function beat(page: Page, factor = 1) {
  if (PACE > 0) await page.waitForTimeout(PACE * factor)
}

export async function login(page: Page, username: string, password: string) {
  await page.goto('/login')
  await page.getByTestId('login-username').fill(username)
  await page.getByTestId('login-password').fill(password)
  await beat(page)
  await page.getByTestId('login-submit').click()
  await expect(page).not.toHaveURL(/\/login/)
  await beat(page)
}
