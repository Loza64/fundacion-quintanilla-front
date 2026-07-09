import { queryKeys } from '@/lib/queryClient'
import type Egreso from '@/models/api/entities/Egreso'
import type { CrudField } from '@/models/app/crud'
import { egresoService } from '@/services/api'
import CrudView from '@/views/core/CrudView'
import type { ColumnsType } from 'antd/es/table'

export default function EgresoView({
  scopeResidenteId,
}: {
  scopeResidenteId: number
}) {
  const columns: ColumnsType<Egreso> = [
    {
      title: 'Fecha de egreso',
      dataIndex: 'fecha_egreso',
      key: 'fecha_egreso',
      align: 'center',
      render: (value: string) => (value ? value.split('T')[0] : '—'),
    },
    {
      title: 'Motivo',
      dataIndex: 'motivo_egreso',
      key: 'motivo_egreso',
      align: 'center',
    },
    { title: 'Destino', dataIndex: 'destino', key: 'destino', align: 'center' },
    {
      title: 'Responsable',
      dataIndex: 'responsable_egreso',
      key: 'responsable_egreso',
      align: 'center',
    },
  ]

  const fields: CrudField[] = [
    {
      name: 'fecha_egreso',
      label: 'Fecha de egreso',
      type: 'date',
      required: true,
    },
    { name: 'motivo_egreso', label: 'Motivo de egreso' },
    { name: 'destino', label: 'Destino' },
    { name: 'responsable_egreso', label: 'Responsable de egreso' },
    { name: 'observaciones', label: 'Observaciones', type: 'textarea' },
  ]

  return (
    <CrudView<Egreso>
      service={egresoService}
      queryKey={queryKeys.egresos}
      label="egreso"
      dateFilter={{ label: 'Fecha de egreso' }}
      searchable={false}
      columns={columns}
      fields={fields}
      fetchOne={(id) => egresoService.findById({ id })}
      toFormValues={(item) => ({
        fecha_egreso: item.fecha_egreso,
        motivo_egreso: item.motivo_egreso,
        destino: item.destino,
        responsable_egreso: item.responsable_egreso,
        observaciones: item.observaciones,
      })}
      scopeParams={{ residente: scopeResidenteId }}
      defaults={{ residente: { id: scopeResidenteId } }}
    />
  )
}
