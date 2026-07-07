import { useFindAll } from '@/hooks/core/useFindAll'
import { queryKeys } from '@/lib/queryClient'
import type ResidenteServicio from '@/models/api/entities/ResidenteServicio'
import type Servicio from '@/models/api/entities/Servicio'
import type { CrudField } from '@/models/app/crud'
import { residenteServicioService, servicioService } from '@/services/api'
import CrudView from '@/views/core/CrudView'
import type { ColumnsType } from 'antd/es/table'

export default function ResidenteServicioView({
  scopeResidenteId,
}: {
  scopeResidenteId: number
}) {
  const { data: serviciosData } = useFindAll<Servicio>({
    queryKey: queryKeys.servicios,
    service: servicioService,
    queryParams: { page: 1, size: 200 },
  })

  const servicioOptions = (serviciosData?.data ?? []).map((servicio) => ({
    label: servicio.nombre,
    value: servicio.id ?? 0,
  }))

  const columns: ColumnsType<ResidenteServicio> = [
    {
      title: 'Servicio',
      dataIndex: ['servicio', 'nombre'],
      key: 'servicio',
      align: 'center',
    },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha', align: 'center' },
    {
      title: 'Observaciones',
      dataIndex: 'observaciones',
      key: 'observaciones',
    },
  ]

  const fields: CrudField[] = [
    {
      name: 'servicio',
      label: 'Servicio',
      type: 'select',
      required: true,
      options: servicioOptions,
    },
    { name: 'fecha', label: 'Fecha', type: 'date' },
    { name: 'observaciones', label: 'Observaciones', type: 'textarea' },
  ]

  return (
    <CrudView<ResidenteServicio>
      service={residenteServicioService}
      queryKey={queryKeys.residenteServicio}
      label="servicio asignado"
      searchable={false}
      columns={columns}
      fields={fields}
      fetchOne={(id) => residenteServicioService.findById({ id })}
      toFormValues={(item) => ({
        servicio: item.servicio?.id,
        fecha: item.fecha,
        observaciones: item.observaciones,
      })}
      toPayload={(values) => {
        const { servicio, ...rest } = values
        const payload: Record<string, unknown> = { ...rest }
        if (servicio != null) payload.servicio = { id: servicio }
        return payload as Partial<ResidenteServicio>
      }}
      scopeParams={{ residente: scopeResidenteId }}
      defaults={{ residente: { id: scopeResidenteId } }}
    />
  )
}
