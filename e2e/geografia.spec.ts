import { test, expect } from '@playwright/test'
import { login, beat, go, pickOption } from './helpers'

// Tour de la integración geografía + Excel:
// catálogos País/División (seed SV/HN), selector de división en Albergue,
// selector de país de nacimiento en Persona y exportación a Excel.
test('Tour Geografía + Excel', async ({ page }) => {
  const sfx = Date.now().toString().slice(-6)
  const L = (x: number) => String.fromCharCode(65 + (x % 26))
  const iso2 = `${L(Number(sfx.slice(0, 2)))}${L(Number(sfx.slice(2, 4)))}`
  const iso3 = `${iso2}${L(Number(sfx.slice(4, 6)))}`

  await test.step('Iniciar sesión como super administrador', async () => {
    await login(page, 'superadmin', 'superadmin123')
  })

  await test.step('Países: seed SV/HN visible y alta de país', async () => {
    await go(page, '/paises')
    await expect(
      page.getByRole('cell', { name: 'El Salvador', exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole('cell', { name: 'Honduras', exact: true })
    ).toBeVisible()

    const nombre = `e2e_pais_${sfx}`
    await page.getByTestId('pais-new').click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByTestId('pais-field-nombre').fill(nombre)
    await page.getByTestId('pais-field-codigoIso2').fill(iso2)
    await page.getByTestId('pais-field-codigoIso3').fill(iso3)
    await page.getByTestId('pais-form-submit').click()
    await expect(
      page.getByRole('cell', { name: nombre, exact: true })
    ).toBeVisible()
  })

  await test.step('Países: exportar a Excel descarga un .xlsx', async () => {
    const downloadPromise = page.waitForEvent('download')
    await page.getByTestId('pais-export').click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/\.xlsx$/)
    await beat(page)
  })

  await test.step('Divisiones: departamentos sembrados y alta con país', async () => {
    await go(page, '/divisiones-geograficas')
    await expect(
      page.getByRole('cell', { name: 'San Salvador', exact: true })
    ).toBeVisible()

    const nombre = `e2e_div_${sfx}`
    await page.getByTestId('division-geografica-new').click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByTestId('division-geografica-field-nombre').fill(nombre)
    await pickOption(page, 'division-geografica-field-tipo', 'municipio')
    await pickOption(page, 'division-geografica-field-pais', 'El Salvador')
    await page.getByTestId('division-geografica-form-submit').click()
    await expect(page.getByText('división geográfica creado')).toBeVisible()

    // La lista pagina (32 departamentos sembrados): filtramos por el buscador
    await page.getByTestId('division-geografica-search').fill(nombre)
    await expect(
      page.getByRole('cell', { name: nombre, exact: true })
    ).toBeVisible()
  })

  await test.step('Albergue: alta con selector de división geográfica', async () => {
    await go(page, '/albergues')
    const nombre = `e2e_alb_${sfx}`
    await page.getByTestId('albergue-new').click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByTestId('albergue-field-nombre').fill(nombre)
    await page.getByTestId('albergue-field-direccion').fill('Calle e2e 123')
    await pickOption(page, 'albergue-field-tipo', 'Mixto')
    await page.getByTestId('albergue-field-capacidad_maxima').fill('25')
    await pickOption(page, 'albergue-field-divisionGeografica', 'San Salvador')
    await page.getByTestId('albergue-form-submit').click()
    await expect(
      page.getByRole('cell', { name: nombre, exact: true })
    ).toBeVisible()

    // Detalle: la división queda persistida y se muestra con su país
    const row = page.getByRole('row', { name: new RegExp(nombre) })
    await row.getByRole('button', { name: 'Ver' }).click()
    const drawer = page.getByLabel('Detalle de albergue')
    await expect(drawer.getByText('San Salvador (El Salvador)')).toBeVisible()
    await page.keyboard.press('Escape')
  })

  await test.step('Persona: alta con País de nacimiento', async () => {
    await go(page, '/personas')
    const nombre = `e2ePersona${sfx}`
    await page.getByTestId('persona-new').click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByTestId('persona-field-nombres').fill(nombre)
    await page.getByTestId('persona-field-apellidos').fill('Apellido')

    const dob = page.getByTestId('persona-field-fecha_nacimiento')
    await dob.click()
    await dob.fill('01/01/2000')
    await page.keyboard.press('Enter')

    await page.getByTestId('persona-field-edad').fill('25')
    await pickOption(page, 'persona-field-sexo', 'Masculino')
    await pickOption(page, 'persona-field-estado_civil', 'Soltero')
    await pickOption(page, 'persona-field-paisNacimiento', 'El Salvador')
    await page.getByTestId('persona-field-idioma').fill('Español')
    await page.getByTestId('persona-form-submit').click()
    await expect(page.getByText('persona creado')).toBeVisible()

    await page.getByTestId('persona-search').fill(nombre)
    await expect(
      page.getByRole('cell', { name: nombre, exact: true })
    ).toBeVisible()

    // Detalle: se muestra el País de nacimiento con su valor
    const row = page.getByRole('row', { name: new RegExp(nombre) })
    await row.getByRole('button', { name: 'Ver' }).click()
    const drawer = page.getByLabel('Detalle de persona')
    await expect(drawer.getByText('El Salvador', { exact: true })).toBeVisible()
    await page.keyboard.press('Escape')
  })

  await test.step('Persona: exportar a Excel descarga un .xlsx', async () => {
    const downloadPromise = page.waitForEvent('download')
    await page.getByTestId('persona-export').click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/\.xlsx$/)
    await beat(page)
  })
})
