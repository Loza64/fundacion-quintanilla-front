import { useFindAll } from '@/hooks/core/useFindAll'
import { queryKeys } from '@/lib/queryClient'
import type AsignacionHabitacion from '@/models/api/entities/AsignacionHabitacion'
import type Habitacion from '@/models/api/entities/Habitacion'
import type { CrudField } from '@/models/app/crud'
import { asignacionHabitacionService, habitacionService } from '@/services/api'
import CrudView from '@/views/core/CrudView'
import { Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

export default function AsignacionHabitacionView({
  scopeResidenteId,
  scopeHabitacionId,
}: {
  scopeResidenteId?: number
  scopeHabitacionId?: number
}) {
  const scopedHab = scopeHabitacionId != null

  const { data: habitacionesData } = useFindAll<Habitacion>({
    queryKey: queryKeys.habitaciones,
    service: habitacionService,
    queryParams: { page: 1, size: 200 },
  })

  const habitacionOptions = (habitacionesData?.data ?? []).map(
    (habitacion) => ({
      label: habitacion.albergue
        ? `${habitacion.nombre} (${habitacion.albergue.nombre})`
        : habitacion.nombre,
      value: habitacion.id ?? 0,
    })
  )

  const fechaCols: ColumnsType<AsignacionHabitacion> = [
    {
      title: 'Inicio',
      dataIndex: 'fecha_inicio',
      key: 'fecha_inicio',
      align: 'center',
    },
    { title: 'Fin', dataIndex: 'fecha_fin', key: 'fecha_fin', align: 'center' },
    {
      title: 'Activa',
      dataIndex: 'activa',
      key: 'activa',
      align: 'center',
      render: (activa?: boolean) => (
        <Tag color={activa ? 'green' : 'default'}>{activa ? 'Sí' : 'No'}</Tag>
      ),
    },
  ]

  const columns: ColumnsType<AsignacionHabitacion> = scopedHab
    ? [
        {
          title: 'Residente',
          key: 'residente',
          align: 'center',
          render: (_, item) => {
            const persona = item.residente?.expediente?.persona
            return persona ? `${persona.nombres} ${persona.apellidos}` : '—'
          },
        },
        ...fechaCols,
      ]
    : [
        {
          title: 'Habitación',
          dataIndex: ['habitacion', 'nombre'],
          key: 'habitacion',
          align: 'center',
        },
        ...fechaCols,
      ]

  const fields: CrudField[] = [
    {
      name: 'habitacion',
      label: 'Habitación',
      type: 'select',
      required: true,
      options: habitacionOptions,
    },
    {
      name: 'fecha_inicio',
      label: 'Fecha de inicio',
      type: 'date',
      required: true,
    },
    { name: 'fecha_fin', label: 'Fecha de fin', type: 'date' },
    { name: 'activa', label: 'Activa', type: 'switch' },
  ]

  return (
    <CrudView<AsignacionHabitacion>
      service={asignacionHabitacionService}
      queryKey={queryKeys.asignacionHabitacion}
      label="asignación"
      searchable={false}
      canCreate={!scopedHab}
      canEdit={() => !scopedHab}
      canDelete={() => !scopedHab}
      restorable={!scopedHab}
      columns={columns}
      fields={fields}
      fetchOne={(id) => asignacionHabitacionService.findById({ id })}
      toFormValues={(item) => ({
        habitacion: item.habitacion?.id,
        fecha_inicio: item.fecha_inicio,
        fecha_fin: item.fecha_fin,
        activa: item.activa ?? true,
      })}
      toPayload={(values) => {
        const { habitacion, ...rest } = values
        const payload: Record<string, unknown> = { ...rest }
        if (habitacion != null) payload.habitacion = { id: habitacion }
        return payload as Partial<AsignacionHabitacion>
      }}
      scopeParams={
        scopedHab
          ? { habitacion: scopeHabitacionId }
          : { residente: scopeResidenteId }
      }
      defaults={
        scopedHab
          ? { habitacion: { id: scopeHabitacionId } }
          : { residente: { id: scopeResidenteId } }
      }
    />
  )
}
