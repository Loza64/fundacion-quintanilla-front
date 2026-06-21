import { test, expect } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import { login } from './helpers'

const AVATAR = fileURLToPath(new URL('./assets/avatar.png', import.meta.url))

test('Persona: el formulario sube una foto de perfil', async ({ page }) => {
  await login(page, 'admin', 'admin123')
  await page.goto('/personas')
  await page.getByTestId('persona-new').click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText('Sin foto')).toBeVisible()

  await dialog.locator('input[type="file"]').setInputFiles(AVATAR)

  await expect(dialog.getByRole('img', { name: 'Avatar' })).toBeVisible()
})
