import dayjs from 'dayjs'
import { humanize } from '@/utils/options'

export const CHART_COLORS = [
  '#16a34a',
  '#0ea5e9',
  '#f59e0b',
  '#7c3aed',
  '#dc2626',
  '#0891b2',
  '#db2777',
  '#65a30d',
  '#ea580c',
  '#4f46e5',
  '#059669',
  '#9333ea',
]

export const colorAt = (index: number) =>
  CHART_COLORS[index % CHART_COLORS.length]

export interface Slice {
  name: string
  value: number
}

export function countBy<T>(
  items: T[],
  keyFn: (item: T) => string | undefined | null,
  { humanizeLabels = false }: { humanizeLabels?: boolean } = {}
): Slice[] {
  const map = new Map<string, number>()
  for (const item of items) {
    const raw = keyFn(item)
    if (raw == null || raw === '') continue
    const key = humanizeLabels ? humanize(raw) : raw
    map.set(key, (map.get(key) ?? 0) + 1)
  }
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

export function sumBy<T>(
  items: T[],
  keyFn: (item: T) => string | undefined | null,
  valueFn: (item: T) => number
): Slice[] {
  const map = new Map<string, number>()
  for (const item of items) {
    const key = keyFn(item)
    if (key == null || key === '') continue
    map.set(key, (map.get(key) ?? 0) + valueFn(item))
  }
  return [...map.entries()]
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => b.value - a.value)
}

export function monthlySeries(from: string, to: string): string[] {
  const months: string[] = []
  let cursor = dayjs(from).startOf('month')
  const end = dayjs(to).startOf('month')
  while (cursor.isBefore(end) || cursor.isSame(end)) {
    months.push(cursor.format('YYYY-MM'))
    cursor = cursor.add(1, 'month')
    if (months.length > 60) break
  }
  return months
}

export function bucketByMonth<T>(
  items: T[],
  dateFn: (item: T) => string | undefined | null
): Map<string, T[]> {
  const map = new Map<string, T[]>()
  for (const item of items) {
    const raw = dateFn(item)
    if (!raw) continue
    const key = dayjs(raw).format('YYYY-MM')
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(item)
  }
  return map
}

export const monthLabel = (ym: string) => dayjs(ym + '-01').format('MMM YYYY')

export const rangoEdad = (edad?: number | null): string => {
  if (edad == null) return 'Sin dato'
  if (edad < 12) return '0-11'
  if (edad < 18) return '12-17'
  if (edad < 30) return '18-29'
  if (edad < 45) return '30-44'
  if (edad < 60) return '45-59'
  return '60+'
}

export const money = (n: number) =>
  `$${n.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
