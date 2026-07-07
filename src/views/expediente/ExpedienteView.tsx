import { useFindAll } from '@/hooks/core/useFindAll'
import { ESTADO_EXPEDIENTE, NIVEL_RIESGO } from '@/enum/catalog'
import { queryKeys } from '@/lib/queryClient'
import type Expediente from '@/models/api/entities/Expediente'
import type Persona from '@/models/api/entities/Persona'
import type {
  CrudField,
  CrudFilter,
  CrudSummaryItem,
  RelationTab,
} from '@/models/app/crud'
import { expedienteService, personaService } from '@/services/api'
import { enumOptions, humanize } from '@/utils/options'
import CrudView from '@/views/core/CrudView'
import HistorialExpedienteView from '@/views/expediente/HistorialExpedienteView'
import ValoracionProfesionalView from '@/views/expediente/ValoracionProfesionalView'
import ResidenteView from '@/views/residente/ResidenteView'
import { Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

const ESTADO_COLOR: Record<string, string> = {
  ABIERTO: 'blue',
  EN_REVISION: 'gold',
  ACTIVO: 'green',
  SUSPENDIDO: 'orange',
  CERRADO: 'default',
  ARCHIVADO: 'default',
}

const RIESGO_COLOR: Record<string, string> = {
  BAJO: 'green',
  MEDIO: 'gold',
  ALTO: 'orange',
  CRITICO: 'red',
}

export default function ExpedienteView({
  scopePersonaId,
}: {
  scopePersonaId?: number
}) {
  const scoped = scopePersonaId != null

  const { data: personasData } = useFindAll<Persona>({
    queryKey: queryKeys.personas,
    service: personaService,
    queryParams: { page: 1, size: 200 },
  })

  const personaOptions = (personasData?.data ?? []).map((persona) => ({
    label: `${persona.nombres} ${persona.apellidos}`,
    value: persona.id ?? 0,
  }))

  const estadoOptions = enumOptions(ESTADO_EXPEDIENTE)
  const riesgoOptions = enumOptions(NIVEL_RIESGO)

  const columns: ColumnsType<Expediente> = [
    { title: 'ID', dataIndex: 'id', key: 'id', align: 'center' },
    ...(scoped
      ? []
      : [
          {
            title: 'Persona',
            key: 'persona',
            align: 'center' as const,
            render: (_: unknown, record: Expediente) =>
              record.persona
                ? `${record.persona.nombres} ${record.persona.apellidos}`
                : '—',
          },
        ]),
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      align: 'center',
      render: (value: string) => (
        <Tag color={ESTADO_COLOR[value] ?? 'default'}>{humanize(value)}</Tag>
      ),
    },
    {
      title: 'Nivel de riesgo',
      dataIndex: 'nivel_riesgo',
      key: 'nivel_riesgo',
      align: 'center',
      render: (value?: string) =>
        value ? (
          <Tag color={RIESGO_COLOR[value] ?? 'default'}>{humanize(value)}</Tag>
        ) : (
          '—'
        ),
    },
  ]

  const fields: CrudField[] = [
    ...(scoped
      ? []
      : [
          {
            name: 'persona',
            label: 'Persona',
            type: 'select' as const,
            required: true,
            options: personaOptions,
          },
        ]),
    {
      name: 'estado',
      label: 'Estado',
      type: 'select',
      required: true,
      options: estadoOptions,
    },
    {
      name: 'nivel_riesgo',
      label: 'Nivel de riesgo',
      type: 'select',
      options: riesgoOptions,
    },
    { name: 'referencia_ingreso', label: 'Referencia de ingreso' },
    {
      name: 'observaciones_generales',
      label: 'Observaciones generales',
      type: 'textarea',
    },
  ]

  const filters: CrudFilter[] = [
    { name: 'estado', label: 'Estado', options: estadoOptions },
    { name: 'nivel_riesgo', label: 'Nivel de riesgo', options: riesgoOptions },
  ]

  const summary = (expediente: Expediente): CrudSummaryItem[] => [
    {
      label: 'Persona',
      value: expediente.persona
        ? `${expediente.persona.nombres} ${expediente.persona.apellidos}`
        : '—',
    },
    { label: 'Estado', value: humanize(expediente.estado) },
    {
      label: 'Nivel de riesgo',
      value: expediente.nivel_riesgo ? humanize(expediente.nivel_riesgo) : '—',
    },
    {
      label: 'Referencia de ingreso',
      value: expediente.referencia_ingreso || '—',
    },
    {
      label: 'Observaciones',
      value: expediente.observaciones_generales || '—',
    },
  ]

  const relations: RelationTab<Expediente>[] = [
    {
      key: 'historial',
      label: 'Historial',
      render: (expediente) => (
        <HistorialExpedienteView scopeExpedienteId={expediente.id ?? 0} />
      ),
    },
    {
      key: 'valoraciones',
      label: 'Valoraciones',
      render: (expediente) => (
        <ValoracionProfesionalView scopeExpedienteId={expediente.id ?? 0} />
      ),
    },
    {
      key: 'residentes',
      label: 'Residentes',
      render: (expediente) => (
        <ResidenteView scopeExpedienteId={expediente.id ?? 0} />
      ),
    },
  ]

  return (
    <CrudView<Expediente>
      service={expedienteService}
      queryKey={queryKeys.expedientes}
      label="expediente"
      searchable={!scoped}
      columns={columns}
      fields={fields}
      filters={filters}
      fetchOne={(id) => expedienteService.findById({ id })}
      toFormValues={(expediente) => ({
        ...(scoped ? {} : { persona: expediente.persona?.id }),
        estado: expediente.estado,
        nivel_riesgo: expediente.nivel_riesgo,
        referencia_ingreso: expediente.referencia_ingreso,
        observaciones_generales: expediente.observaciones_generales,
      })}
      toPayload={(values) => {
        const { persona, ...rest } = values
        const payload: Record<string, unknown> = { ...rest }
        if (!scoped && persona != null) payload.persona = { id: persona }
        return payload as Partial<Expediente>
      }}
      summary={summary}
      relations={relations}
      scopeParams={scoped ? { persona: scopePersonaId } : undefined}
      defaults={scoped ? { persona: { id: scopePersonaId } } : undefined}
    />
  )
}
