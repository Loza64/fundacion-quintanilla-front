import type { CrudSelectOption } from '@/models/app/crud'

export function humanize(value: string): string {
  const text = value.toLowerCase().replace(/_/g, ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function enumOptions(values: readonly string[]): CrudSelectOption[] {
  return values.map((value) => ({ label: humanize(value), value }))
}
