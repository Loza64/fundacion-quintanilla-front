import { expect, type Page, type APIRequestContext } from '@playwright/test'

const API = 'http://localhost:4000/api'

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

export async function go(page: Page, path: string) {
  await page.goto(path)
  await beat(page)
}

// Select de AntD v6 dentro de un modal: combobox + escribir + Enter.
export async function pickOption(
  page: Page,
  testId: string,
  optionName: string
) {
  const combo = page.getByTestId(testId).getByRole('combobox')
  await combo.click()
  await combo.fill(optionName)
  await page.keyboard.press('Enter')
  await beat(page)
}

export async function openFirstDetail(page: Page, tabs: string[]) {
  await page.getByRole('button', { name: 'Ver' }).first().click()
  for (const tab of tabs) {
    await expect(page.getByRole('tab', { name: tab })).toBeVisible()
  }
  await beat(page)
}

// Limpia registros de prueba (e2e_*) por API, no por UI.
export async function cleanupTestData(request: APIRequestContext) {
  const res = await request.post(`${API}/auth/login`, {
    data: { username: 'admin', password: 'admin123' },
  })
  const token = (await res.json()).token as string
  const headers = { Authorization: `Bearer ${token}` }

  for (const resource of ['users', 'servicios']) {
    const list = await request.get(`${API}/${resource}?size=100&search=e2e_`, {
      headers,
    })
    for (const item of (await list.json()).data ?? []) {
      await request.patch(`${API}/${resource}/${item.id}/soft-delete`, {
        headers,
      })
    }
  }
}
