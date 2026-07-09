import { queryKeys } from '@/lib/queryClient'
import type Ingreso from '@/models/api/entities/Ingreso'
import type { CrudField } from '@/models/app/crud'
import { ingresoService } from '@/services/api'
import CrudView from '@/views/core/CrudView'
import type { ColumnsType } from 'antd/es/table'

export default function IngresoView({
  scopeResidenteId,
}: {
  scopeResidenteId: number
}) {
  const columns: ColumnsType<Ingreso> = [
    {
      title: 'Fecha de ingreso',
      dataIndex: 'fecha_ingreso',
      key: 'fecha_ingreso',
      align: 'center',
      render: (value: string) => (value ? value.split('T')[0] : '—'),
    },
    { title: 'Motivo', dataIndex: 'motivo', key: 'motivo', align: 'center' },
    {
      title: 'Referido por',
      dataIndex: 'referido_por',
      key: 'referido_por',
      align: 'center',
    },
    {
      title: 'Responsable',
      dataIndex: 'responsable_ingreso',
      key: 'responsable_ingreso',
      align: 'center',
    },
  ]

  const fields: CrudField[] = [
    {
      name: 'fecha_ingreso',
      label: 'Fecha de ingreso',
      type: 'date',
      required: true,
    },
    { name: 'motivo', label: 'Motivo' },
    { name: 'referido_por', label: 'Referido por' },
    { name: 'responsable_ingreso', label: 'Responsable de ingreso' },
    { name: 'observaciones', label: 'Observaciones', type: 'textarea' },
  ]

  return (
    <CrudView<Ingreso>
      service={ingresoService}
      queryKey={queryKeys.ingresos}
      label="ingreso"
      dateFilter={{
        label: 'Fecha',
        fieldOptions: [
          { value: 'ingreso', label: 'Fecha de ingreso' },
          { value: 'createdAt', label: 'Fecha de registro' },
        ],
      }}
      searchable={false}
      columns={columns}
      fields={fields}
      fetchOne={(id) => ingresoService.findById({ id })}
      toFormValues={(item) => ({
        fecha_ingreso: item.fecha_ingreso,
        motivo: item.motivo,
        referido_por: item.referido_por,
        responsable_ingreso: item.responsable_ingreso,
        observaciones: item.observaciones,
      })}
      scopeParams={{ residente: scopeResidenteId }}
      defaults={{ residente: { id: scopeResidenteId } }}
    />
  )
}
