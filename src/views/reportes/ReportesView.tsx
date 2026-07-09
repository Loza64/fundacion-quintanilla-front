import { useFindAll } from '@/hooks/core/useFindAll'
import { queryKeys } from '@/lib/queryClient'
import type AbstractService from '@/models/api/core/AbstractService'
import type BaseEntity from '@/models/api/core/_BaseEntity'
import type Residente from '@/models/api/entities/Residente'
import type Persona from '@/models/api/entities/Persona'
import type Habitacion from '@/models/api/entities/Habitacion'
import type Recibo from '@/models/api/entities/Recibo'
import type Ingreso from '@/models/api/entities/Ingreso'
import type Egreso from '@/models/api/entities/Egreso'
import type Expediente from '@/models/api/entities/Expediente'
import type PersonaBeneficio from '@/models/api/entities/PersonaBeneficio'
import {
  albergueService,
  beneficioService,
  egresoService,
  expedienteService,
  habitacionService,
  ingresoService,
  personaBeneficioService,
  personaService,
  reciboService,
  residenteService,
  servicioService,
} from '@/services/api'
import { Card, Col, DatePicker, Row, Statistic } from 'antd'
import {
  BedDouble,
  Building2,
  Contact,
  FolderOpen,
  Gift,
  HousePlus,
  Receipt,
  UserCheck,
  Wrench,
} from 'lucide-react'
import type { ReactNode } from 'react'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { BarCard, LineCard, MultiColorBarCard, PieCard } from './ChartCards'
import {
  bucketByMonth,
  colorAt,
  countBy,
  money,
  monthLabel,
  monthlySeries,
  rangoEdad,
  sumBy,
} from './reportUtils'

const { RangePicker } = DatePicker
const BIG = 500

interface StatCardProps<Entity extends BaseEntity> {
  title: string
  service: AbstractService<Entity>
  queryKey: string[]
  extraParams?: Record<string, unknown>
  icon: ReactNode
  color: string
}

function StatCard<Entity extends BaseEntity>({
  title,
  service,
  queryKey,
  extraParams,
  icon,
  color,
}: StatCardProps<Entity>) {
  const { data, isLoading } = useFindAll<Entity>({
    queryKey,
    service,
    queryParams: { page: 1, size: 1, ...extraParams },
  })

  return (
    <Card>
      <div className="flex items-center gap-4">
        <div
          className="flex size-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}1a`, color }}
        >
          {icon}
        </div>
        <Statistic
          title={title}
          value={data?.pagination.total ?? 0}
          loading={isLoading}
        />
      </div>
    </Card>
  )
}

export default function ReportesView() {
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(12, 'month').startOf('month'),
    dayjs().endOf('month'),
  ])

  const from = range[0].format('YYYY-MM-DD')
  const to = range[1].format('YYYY-MM-DD')
  const rangeKey = `${from}_${to}`

  const useList = <T extends BaseEntity>(
    key: string[],
    service: Parameters<typeof useFindAll<T>>[0]['service'],
    queryParams: Record<string, unknown>
  ) =>
    useFindAll<T>({
      queryKey: key,
      service,
      queryParams: { page: 1, size: BIG, ...queryParams },
    })

  const residentesRango = useList<Residente>(
    [...queryKeys.residentes, 'rep-rango', rangeKey],
    residenteService,
    { type: 'fecha_ingreso', from, to }
  )
  const residentesAll = useList<Residente>(
    [...queryKeys.residentes, 'rep-all'],
    residenteService,
    {}
  )
  const personas = useList<Persona>(
    [...queryKeys.personas, 'rep'],
    personaService,
    {}
  )
  const habitaciones = useList<Habitacion>(
    [...queryKeys.habitaciones, 'rep'],
    habitacionService,
    {}
  )
  const recibos = useList<Recibo>(
    [...queryKeys.recibos, 'rep', rangeKey],
    reciboService,
    { type: 'fecha_emision', from, to }
  )
  const ingresos = useList<Ingreso>(
    [...queryKeys.ingresos, 'rep', rangeKey],
    ingresoService,
    { type: 'ingreso', from, to }
  )
  const egresos = useList<Egreso>(
    [...queryKeys.egresos, 'rep', rangeKey],
    egresoService,
    { from, to }
  )
  const expedientes = useList<Expediente>(
    [...queryKeys.expedientes, 'rep', rangeKey],
    expedienteService,
    { from, to }
  )
  const beneficios = useList<PersonaBeneficio>(
    [...queryKeys.personaBeneficio, 'rep', rangeKey],
    personaBeneficioService,
    { type: 'fecha', from, to }
  )

  const EMPTY: never[] = useMemo(() => [], [])
  const rResidentesRango = residentesRango.data?.data ?? EMPTY
  const rResidentesAll = residentesAll.data?.data ?? EMPTY
  const rPersonas = personas.data?.data ?? EMPTY
  const rHabitaciones = habitaciones.data?.data ?? EMPTY
  const rRecibos = recibos.data?.data ?? EMPTY
  const rIngresos = ingresos.data?.data ?? EMPTY
  const rEgresos = egresos.data?.data ?? EMPTY
  const rExpedientes = expedientes.data?.data ?? EMPTY
  const rBeneficios = beneficios.data?.data ?? EMPTY

  const flujoMensual = useMemo(() => {
    const meses = monthlySeries(from, to)
    const ing = bucketByMonth(rIngresos, (i) => i.fecha_ingreso)
    const egr = bucketByMonth(rEgresos, (e) => e.fecha_egreso)
    return meses.map((m) => ({
      mes: monthLabel(m),
      Ingresos: ing.get(m)?.length ?? 0,
      Egresos: egr.get(m)?.length ?? 0,
    }))
  }, [rIngresos, rEgresos, from, to])

  const montoMensual = useMemo(() => {
    const meses = monthlySeries(from, to)
    const byMonth = bucketByMonth(rRecibos, (r) => r.fecha_emision)
    return meses.map((m) => ({
      mes: monthLabel(m),
      Monto:
        Math.round(
          (byMonth.get(m) ?? []).reduce((acc, r) => acc + Number(r.monto), 0) *
            100
        ) / 100,
    }))
  }, [rRecibos, from, to])

  const recibosPorTipo = countBy(rRecibos, (r) => r.tipo_recibo, {
    humanizeLabels: true,
  })
  const montoPorAlbergue = sumBy(
    rRecibos,
    (r) => r.albergue?.nombre ?? null,
    (r) => Number(r.monto)
  )
  const residentesRangoPorAlbergue = countBy(
    rResidentesRango,
    (r) => r.albergue?.nombre ?? null
  )

  const ocupacionPorAlbergue = useMemo(() => {
    const activos = new Map<string, number>()
    for (const r of rResidentesAll) {
      if (r.activo === false) continue
      const nombre = r.albergue?.nombre
      if (!nombre) continue
      activos.set(nombre, (activos.get(nombre) ?? 0) + 1)
    }
    return [...activos.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [rResidentesAll])

  const habitacionesPorEstado = countBy(rHabitaciones, (h) => h.estado, {
    humanizeLabels: true,
  })
  const personasPorPais = countBy(
    rPersonas,
    (p) => p.paisNacimiento?.nombre ?? null
  )
  const personasPorSexo = countBy(rPersonas, (p) => p.sexo, {
    humanizeLabels: true,
  })
  const personasPorEdad = useMemo(() => {
    const orden = [
      '0-11',
      '12-17',
      '18-29',
      '30-44',
      '45-59',
      '60+',
      'Sin dato',
    ]
    const counts = countBy(rPersonas, (p) => rangoEdad(p.edad))
    return orden
      .map((name) => counts.find((c) => c.name === name) ?? { name, value: 0 })
      .filter((c) => c.value > 0)
  }, [rPersonas])
  const expedientesPorRiesgo = countBy(rExpedientes, (e) => e.nivel_riesgo, {
    humanizeLabels: true,
  })
  const beneficiosPorTipo = countBy(rBeneficios, (b) => b.beneficio?.tipo, {
    humanizeLabels: true,
  })

  const kpis = [
    {
      title: 'Ingresos en rango',
      value: rIngresos.length,
      color: '#16a34a',
    },
    { title: 'Egresos en rango', value: rEgresos.length, color: '#dc2626' },
    {
      title: 'Recaudado en rango',
      value: money(rRecibos.reduce((a, r) => a + Number(r.monto), 0)),
      color: '#f59e0b',
    },
  ]

  return (
    <div className="px-4 md:px-6">
      <Card size="small" className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-medium text-gray-600">Rango de fechas:</span>
          <RangePicker
            value={range}
            onChange={(dates) =>
              dates?.[0] && dates?.[1] && setRange([dates[0], dates[1]])
            }
            format="DD/MM/YYYY"
            allowClear={false}
            data-testid="reportes-rango"
          />
        </div>
      </Card>

      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={12} lg={8} xl={6}>
          <StatCard
            title="Personas"
            service={personaService}
            queryKey={[...queryKeys.personas, 'count']}
            icon={<Contact />}
            color="#16a34a"
          />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <StatCard
            title="Residentes activos"
            service={residenteService}
            queryKey={[...queryKeys.residentes, 'count', 'activos']}
            extraParams={{ activo: true }}
            icon={<UserCheck />}
            color="#0ea5e9"
          />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <StatCard
            title="Residentes (total)"
            service={residenteService}
            queryKey={[...queryKeys.residentes, 'count']}
            icon={<HousePlus />}
            color="#6366f1"
          />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <StatCard
            title="Albergues"
            service={albergueService}
            queryKey={[...queryKeys.albergues, 'count']}
            icon={<Building2 />}
            color="#f59e0b"
          />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <StatCard
            title="Habitaciones"
            service={habitacionService}
            queryKey={[...queryKeys.habitaciones, 'count']}
            icon={<BedDouble />}
            color="#db2777"
          />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <StatCard
            title="Expedientes"
            service={expedienteService}
            queryKey={[...queryKeys.expedientes, 'count']}
            icon={<FolderOpen />}
            color="#7c3aed"
          />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <StatCard
            title="Beneficios"
            service={beneficioService}
            queryKey={[...queryKeys.beneficios, 'count']}
            icon={<Gift />}
            color="#9333ea"
          />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <StatCard
            title="Servicios"
            service={servicioService}
            queryKey={[...queryKeys.servicios, 'count']}
            icon={<Wrench />}
            color="#0891b2"
          />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <StatCard
            title="Recibos"
            service={reciboService}
            queryKey={[...queryKeys.recibos, 'count']}
            icon={<Receipt />}
            color="#dc2626"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-4">
        {kpis.map((k) => (
          <Col xs={24} sm={12} lg={8} key={k.title}>
            <Card size="small">
              <Statistic
                title={k.title}
                value={k.value}
                valueStyle={{ color: k.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <LineCard
            title="Ingresos vs Egresos por mes"
            data={flujoMensual}
            loading={ingresos.isLoading || egresos.isLoading}
            series={[
              { key: 'Ingresos', label: 'Ingresos', color: colorAt(0) },
              { key: 'Egresos', label: 'Egresos', color: colorAt(4) },
            ]}
          />
        </Col>
        <Col xs={24} lg={12}>
          <LineCard
            title="Recaudación por mes"
            data={montoMensual}
            loading={recibos.isLoading}
            series={[{ key: 'Monto', label: 'Monto', color: colorAt(2) }]}
            valueFormatter={money}
          />
        </Col>
        <Col xs={24} lg={8}>
          <PieCard
            title="Recibos por tipo"
            data={recibosPorTipo}
            loading={recibos.isLoading}
          />
        </Col>
        <Col xs={24} lg={8}>
          <MultiColorBarCard
            title="Recaudación por albergue"
            data={montoPorAlbergue}
            loading={recibos.isLoading}
            valueFormatter={money}
          />
        </Col>
        <Col xs={24} lg={8}>
          <MultiColorBarCard
            title="Residentes ingresados por albergue"
            data={residentesRangoPorAlbergue}
            loading={residentesRango.isLoading}
          />
        </Col>
        <Col xs={24} lg={8}>
          <MultiColorBarCard
            title="Ocupación actual por albergue"
            data={ocupacionPorAlbergue}
            loading={residentesAll.isLoading}
          />
        </Col>
        <Col xs={24} lg={8}>
          <PieCard
            title="Habitaciones por estado"
            data={habitacionesPorEstado}
            loading={habitaciones.isLoading}
          />
        </Col>
        <Col xs={24} lg={8}>
          <PieCard
            title="Residentes por sexo"
            data={personasPorSexo}
            loading={personas.isLoading}
          />
        </Col>
        <Col xs={24} lg={8}>
          <BarCard
            title="Personas por país de nacimiento"
            data={personasPorPais}
            loading={personas.isLoading}
            horizontal
            color={colorAt(1)}
          />
        </Col>
        <Col xs={24} lg={8}>
          <MultiColorBarCard
            title="Personas por rango de edad"
            data={personasPorEdad}
            loading={personas.isLoading}
          />
        </Col>
        <Col xs={24} lg={8}>
          <MultiColorBarCard
            title="Expedientes por nivel de riesgo"
            data={expedientesPorRiesgo}
            loading={expedientes.isLoading}
          />
        </Col>
        <Col xs={24} lg={8}>
          <MultiColorBarCard
            title="Beneficios otorgados por tipo"
            data={beneficiosPorTipo}
            loading={beneficios.isLoading}
          />
        </Col>
      </Row>
    </div>
  )
}
