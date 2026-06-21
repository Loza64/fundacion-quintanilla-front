import { useFindAll } from '@/hooks/core/useFindAll'
import { queryKeys } from '@/lib/queryClient'
import type AbstractService from '@/models/api/core/AbstractService'
import type BaseEntity from '@/models/api/core/_BaseEntity'
import {
  albergueService,
  beneficioService,
  expedienteService,
  habitacionService,
  personaService,
  reciboService,
  residenteService,
  servicioService,
} from '@/services/api'
import { Card, Col, Row, Statistic } from 'antd'
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
  return (
    <div className="px-4 md:px-6">
      <Row gutter={[16, 16]}>
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
    </div>
  )
}
