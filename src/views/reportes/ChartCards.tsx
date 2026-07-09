import { Card, Empty, Spin } from 'antd'
import type { ReactNode } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { colorAt, type Slice } from './reportUtils'

const HEIGHT = 280

function ChartFrame({
  title,
  loading,
  empty,
  children,
}: {
  title: string
  loading?: boolean
  empty?: boolean
  children: ReactNode
}) {
  return (
    <Card title={title} size="small" className="h-full">
      {loading ? (
        <div className="flex h-70 items-center justify-center">
          <Spin />
        </div>
      ) : empty ? (
        <div className="flex h-70 items-center justify-center">
          <Empty description="Sin datos en el rango" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={HEIGHT}>
          {children as never}
        </ResponsiveContainer>
      )}
    </Card>
  )
}

interface BarCardProps {
  title: string
  data: Slice[]
  loading?: boolean
  color?: string
  horizontal?: boolean
  valueFormatter?: (v: number) => string
}

export function BarCard({
  title,
  data,
  loading,
  color = colorAt(0),
  horizontal = false,
  valueFormatter,
}: BarCardProps) {
  return (
    <ChartFrame title={title} loading={loading} empty={!data.length}>
      <BarChart
        data={data}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{ top: 8, right: 16, bottom: 8, left: horizontal ? 24 : 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        {horizontal ? (
          <>
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fontSize: 12 }}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={50}
            />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
          </>
        )}
        <Tooltip
          formatter={(v) =>
            [valueFormatter ? valueFormatter(Number(v)) : v, ''] as [
              string,
              string,
            ]
          }
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={color} />
          ))}
        </Bar>
      </BarChart>
    </ChartFrame>
  )
}

export function MultiColorBarCard({
  title,
  data,
  loading,
  horizontal = false,
  valueFormatter,
}: BarCardProps) {
  return (
    <ChartFrame title={title} loading={loading} empty={!data.length}>
      <BarChart
        data={data}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{ top: 8, right: 16, bottom: 8, left: horizontal ? 24 : 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        {horizontal ? (
          <>
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fontSize: 12 }}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={50}
            />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
          </>
        )}
        <Tooltip
          formatter={(v) =>
            [valueFormatter ? valueFormatter(Number(v)) : v, ''] as [
              string,
              string,
            ]
          }
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={colorAt(i)} />
          ))}
        </Bar>
      </BarChart>
    </ChartFrame>
  )
}

export function PieCard({
  title,
  data,
  loading,
}: {
  title: string
  data: Slice[]
  loading?: boolean
}) {
  return (
    <ChartFrame title={title} loading={loading} empty={!data.length}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
          label={(entry) => `${entry.name}: ${entry.value}`}
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={colorAt(i)} />
          ))}
        </Pie>
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ChartFrame>
  )
}

interface Series {
  key: string
  label: string
  color: string
}

export function LineCard({
  title,
  data,
  series,
  loading,
  valueFormatter,
}: {
  title: string
  data: Record<string, string | number>[]
  series: Series[]
  loading?: boolean
  valueFormatter?: (v: number) => string
}) {
  return (
    <ChartFrame title={title} loading={loading} empty={!data.length}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
        <Tooltip
          formatter={(v) => (valueFormatter ? valueFormatter(Number(v)) : v)}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        ))}
      </LineChart>
    </ChartFrame>
  )
}
