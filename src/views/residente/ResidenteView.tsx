import { useFindAll } from '@/hooks/core/useFindAll'
import { TIPO_RESIDENTE } from '@/enum/catalog'
import { queryKeys } from '@/lib/queryClient'
import type Albergue from '@/models/api/entities/Albergue'
import type Expediente from '@/models/api/entities/Expediente'
import type Residente from '@/models/api/entities/Residente'
import type {
  CrudField,
  CrudFilter,
  CrudSummaryItem,
  RelationTab,
} from '@/models/app/crud'
import {
  albergueService,
  expedienteService,
  residenteService,
} from '@/services/api'
import { enumOptions, humanize } from '@/utils/options'
import CrudView from '@/views/core/CrudView'
import HistorialExpedienteView from '@/views/expediente/HistorialExpedienteView'
import ReciboView from '@/views/finanzas/ReciboView'
import AsignacionHabitacionView from '@/views/residente/AsignacionHabitacionView'
import EgresoView from '@/views/residente/EgresoView'
import HorarioPupilajeView from '@/views/residente/HorarioPupilajeView'
import IngresoView from '@/views/residente/IngresoView'
import ResidenteServicioView from '@/views/residente/ResidenteServicioView'
import { Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

export default function ResidenteView({
  scopeExpedienteId,
  scopeAlbergueId,
}: {
  scopeExpedienteId?: number
  scopeAlbergueId?: number
}) {
  const scopedExp = scopeExpedienteId != null
  const scopedAlb = scopeAlbergueId != null

  const { data: alberguesData } = useFindAll<Albergue>({
    queryKey: queryKeys.albergues,
    service: albergueService,
    queryParams: { page: 1, size: 200 },
  })
  const { data: expedientesData } = useFindAll<Expediente>({
    queryKey: queryKeys.expedientes,
    service: expedienteService,
    queryParams: { page: 1, size: 200 },
  })

  const albergueOptions = (alberguesData?.data ?? []).map((albergue) => ({
    label: albergue.nombre,
    value: albergue.id ?? 0,
  }))
  const expedienteOptions = (expedientesData?.data ?? []).map((expediente) => ({
    label: expediente.persona
      ? `Exp. ${expediente.id} — ${expediente.persona.nombres} ${expediente.persona.apellidos}`
      : `Expediente ${expediente.id}`,
    value: expediente.id ?? 0,
  }))

  const tipoOptions = enumOptions(TIPO_RESIDENTE)

  const columns: ColumnsType<Residente> = [
    { title: 'ID', dataIndex: 'id', key: 'id', align: 'center' },
    {
      title: 'Persona',
      key: 'persona',
      align: 'center',
      render: (_, record) =>
        record.expediente?.persona
          ? `${record.expediente.persona.nombres} ${record.expediente.persona.apellidos}`
          : '—',
    },
    {
      title: 'Documento',
      key: 'documento',
      align: 'center',
      render: (_, record) =>
        record.expediente?.persona?.documento_identificacion || '—',
    },
    ...(scopedAlb
      ? []
      : [
          {
            title: 'Albergue',
            dataIndex: ['albergue', 'nombre'],
            key: 'albergue',
            align: 'center' as const,
          },
        ]),
    {
      title: 'Tipo',
      dataIndex: 'tipo_residente',
      key: 'tipo_residente',
      align: 'center',
      render: (value: string) => <Tag color="blue">{humanize(value)}</Tag>,
    },
    {
      title: 'Estado',
      dataIndex: 'activo',
      key: 'activo',
      align: 'center',
      render: (activo?: boolean) => (
        <Tag color={activo ? 'green' : 'red'}>
          {activo ? 'Activo' : 'Inactivo'}
        </Tag>
      ),
    },
  ]

  const fields: CrudField[] = [
    ...(scopedExp
      ? []
      : [
          {
            name: 'expediente',
            label: 'Expediente',
            type: 'select' as const,
            required: true,
            options: expedienteOptions,
          },
        ]),
    ...(scopedAlb
      ? []
      : [
          {
            name: 'albergue',
            label: 'Albergue',
            type: 'select' as const,
            required: true,
            options: albergueOptions,
          },
        ]),
    {
      name: 'tipo_residente',
      label: 'Tipo de residente',
      type: 'select',
      required: true,
      options: tipoOptions,
    },
    {
      name: 'fecha_ingreso',
      label: 'Fecha de ingreso',
      type: 'date',
      required: true,
    },
    { name: 'motivo_ingreso', label: 'Motivo de ingreso', type: 'textarea' },
    { name: 'activo', label: 'Activo', type: 'switch' },
  ]

  const filters: CrudFilter[] = [
    ...(scopedAlb
      ? []
      : [{ name: 'albergue', label: 'Albergue', options: albergueOptions }]),
    { name: 'tipo_residente', label: 'Tipo', options: tipoOptions },
  ]

  const summary = (residente: Residente): CrudSummaryItem[] => [
    {
      label: 'Persona',
      value: residente.expediente?.persona
        ? `${residente.expediente.persona.nombres} ${residente.expediente.persona.apellidos}`
        : '—',
    },
    {
      label: 'Tipo de residente',
      value: humanize(residente.tipo_residente),
    },
    {
      label: 'Estado',
      value: residente.activo ? 'Activo' : 'Inactivo',
    },
    { label: 'Albergue', value: residente.albergue?.nombre || '—' },
    {
      label: 'Fecha de ingreso',
      value: residente.fecha_ingreso
        ? residente.fecha_ingreso.split('T')[0]
        : '—',
    },
    { label: 'Motivo de ingreso', value: residente.motivo_ingreso || '—' },
  ]

  const relations: RelationTab<Residente>[] = [
    {
      key: 'historial',
      label: 'Historial',
      render: (residente) => (
        <HistorialExpedienteView
          scopeExpedienteId={residente.expediente?.id ?? 0}
        />
      ),
    },
    {
      key: 'ingresos',
      label: 'Ingresos',
      render: (residente) => (
        <IngresoView scopeResidenteId={residente.id ?? 0} />
      ),
    },
    {
      key: 'egresos',
      label: 'Egresos',
      render: (residente) => (
        <EgresoView scopeResidenteId={residente.id ?? 0} />
      ),
    },
    {
      key: 'asignaciones',
      label: 'Habitaciones',
      render: (residente) => (
        <AsignacionHabitacionView scopeResidenteId={residente.id ?? 0} />
      ),
    },
    {
      key: 'horarios',
      label: 'Horarios',
      render: (residente) => (
        <HorarioPupilajeView scopeResidenteId={residente.id ?? 0} />
      ),
    },
    {
      key: 'servicios',
      label: 'Servicios',
      render: (residente) => (
        <ResidenteServicioView scopeResidenteId={residente.id ?? 0} />
      ),
    },
    {
      key: 'recibos',
      label: 'Recibos',
      render: (residente) => (
        <ReciboView scopeResidenteId={residente.id ?? 0} />
      ),
    },
  ]

  return (
    <CrudView<Residente>
      service={residenteService}
      queryKey={queryKeys.residentes}
      label="residente"
      dateFilter={{
        label: 'Fecha',
        fieldOptions: [
          { value: 'fecha_ingreso', label: 'Ingreso' },
          { value: 'createdAt', label: 'Registro' },
        ],
      }}
      exportable={!scopedExp && !scopedAlb}
      searchable={!scopedExp}
      columns={columns}
      fields={fields}
      filters={filters}
      fetchOne={(id) => residenteService.findById({ id })}
      toFormValues={(residente) => ({
        ...(scopedExp ? {} : { expediente: residente.expediente?.id }),
        ...(scopedAlb ? {} : { albergue: residente.albergue?.id }),
        tipo_residente: residente.tipo_residente,
        fecha_ingreso: residente.fecha_ingreso,
        motivo_ingreso: residente.motivo_ingreso,
        activo: residente.activo ?? true,
      })}
      toPayload={(values) => {
        const { expediente, albergue, ...rest } = values
        const payload: Record<string, unknown> = { ...rest }
        if (!scopedExp && expediente != null)
          payload.expediente = { id: expediente }
        if (!scopedAlb && albergue != null) payload.albergue = { id: albergue }
        return payload as Partial<Residente>
      }}
      summary={summary}
      relations={relations}
      scopeParams={{
        ...(scopedExp ? { expediente: scopeExpedienteId } : {}),
        ...(scopedAlb ? { albergue: scopeAlbergueId } : {}),
      }}
      defaults={{
        ...(scopedExp ? { expediente: { id: scopeExpedienteId } } : {}),
        ...(scopedAlb ? { albergue: { id: scopeAlbergueId } } : {}),
      }}
    />
  )
}
