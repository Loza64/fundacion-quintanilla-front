import { expect, type Page } from '@playwright/test'

export async function login(page: Page, username: string, password: string) {
  await page.goto('/login')
  await page.getByPlaceholder('Usuario').fill(username)
  await page.getByPlaceholder('Contraseña').fill(password)
  await page.getByRole('button', { name: 'Iniciar sesión' }).click()
  await expect(page).not.toHaveURL(/\/login/)
}
