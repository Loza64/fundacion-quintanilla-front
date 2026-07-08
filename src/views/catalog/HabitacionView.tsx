import { useFindAll } from '@/hooks/core/useFindAll'
import { ESTADO_HABITACION, TIPO_HABITACION } from '@/enum/catalog'
import { queryKeys } from '@/lib/queryClient'
import type Albergue from '@/models/api/entities/Albergue'
import type Habitacion from '@/models/api/entities/Habitacion'
import type { CrudField, CrudFilter } from '@/models/app/crud'
import { albergueService, habitacionService } from '@/services/api'
import { enumOptions, humanize } from '@/utils/options'
import CrudView from '@/views/core/CrudView'
import { Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

const ESTADO_COLOR: Record<string, string> = {
  DISPONIBLE: 'green',
  OCUPADA: 'red',
  RESERVADA: 'gold',
  MANTENIMIENTO: 'orange',
  INACTIVA: 'default',
}

export default function HabitacionView({
  scopeAlbergueId,
}: {
  scopeAlbergueId?: number
}) {
  const scoped = scopeAlbergueId != null

  const { data: alberguesData } = useFindAll<Albergue>({
    queryKey: queryKeys.albergues,
    service: albergueService,
    queryParams: { page: 1, size: 200 },
  })

  const albergueOptions = (alberguesData?.data ?? []).map((albergue) => ({
    label: albergue.nombre,
    value: albergue.id ?? 0,
  }))

  const tipoOptions = enumOptions(TIPO_HABITACION)
  const estadoOptions = enumOptions(ESTADO_HABITACION)

  const columns: ColumnsType<Habitacion> = [
    { title: 'ID', dataIndex: 'id', key: 'id', align: 'center' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre', align: 'center' },
    ...(scoped
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
      title: 'Capacidad',
      dataIndex: 'capacidad',
      key: 'capacidad',
      align: 'center',
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      align: 'center',
      render: (tipo: string) => <Tag>{humanize(tipo)}</Tag>,
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      align: 'center',
      render: (estado: string) => (
        <Tag color={ESTADO_COLOR[estado] ?? 'default'}>{humanize(estado)}</Tag>
      ),
    },
  ]

  const fields: CrudField[] = [
    ...(scoped
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
    { name: 'nombre', label: 'Nombre', required: true },
    { name: 'capacidad', label: 'Capacidad', type: 'number', required: true },
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'select',
      required: true,
      options: tipoOptions,
    },
    {
      name: 'estado',
      label: 'Estado',
      type: 'select',
      required: true,
      options: estadoOptions,
    },
  ]

  const filters: CrudFilter[] = [
    ...(scoped
      ? []
      : [{ name: 'albergue', label: 'Albergue', options: albergueOptions }]),
    { name: 'tipo', label: 'Tipo', options: tipoOptions },
    { name: 'estado', label: 'Estado', options: estadoOptions },
  ]

  const toFormValues = (habitacion: Habitacion) => ({
    nombre: habitacion.nombre,
    capacidad: habitacion.capacidad,
    tipo: habitacion.tipo,
    estado: habitacion.estado,
    ...(scoped ? {} : { albergue: habitacion.albergue?.id }),
  })

  const toPayload = (values: Record<string, unknown>) => {
    const { albergue, ...rest } = values
    const payload: Record<string, unknown> = { ...rest }
    if (!scoped && albergue != null) payload.albergue = { id: albergue }
    return payload as Partial<Habitacion>
  }

  return (
    <CrudView<Habitacion>
      service={habitacionService}
      queryKey={queryKeys.habitaciones}
      label="habitación"
      exportable={!scoped}
      columns={columns}
      fields={fields}
      filters={filters}
      toFormValues={toFormValues}
      toPayload={toPayload}
      fetchOne={(id) => habitacionService.findById({ id })}
      scopeParams={scoped ? { albergue: scopeAlbergueId } : undefined}
      defaults={scoped ? { albergue: { id: scopeAlbergueId } } : undefined}
    />
  )
}
