import { queryKeys } from '@/lib/queryClient'
import type HorarioPupilaje from '@/models/api/entities/HorarioPupilaje'
import type { CrudField } from '@/models/app/crud'
import { horarioPupilajeService } from '@/services/api'
import CrudView from '@/views/core/CrudView'
import type { ColumnsType } from 'antd/es/table'

export default function HorarioPupilajeView({
  scopeResidenteId,
}: {
  scopeResidenteId: number
}) {
  const columns: ColumnsType<HorarioPupilaje> = [
    {
      title: 'Día',
      dataIndex: 'dia',
      key: 'dia',
      align: 'center',
      render: (value: string) => (value ? value.split('T')[0] : '—'),
    },
    { title: 'Entrada', dataIndex: 'entrada', key: 'entrada', align: 'center' },
    { title: 'Salida', dataIndex: 'salida', key: 'salida', align: 'center' },
    {
      title: 'Observaciones',
      dataIndex: 'observaciones',
      key: 'observaciones',
    },
  ]

  const fields: CrudField[] = [
    { name: 'dia', label: 'Día', type: 'date', required: true },
    {
      name: 'entrada',
      label: 'Entrada',
      required: true,
      placeholder: 'HH:MM (ej. 08:00)',
    },
    {
      name: 'salida',
      label: 'Salida',
      required: true,
      placeholder: 'HH:MM (ej. 17:00)',
    },
    { name: 'observaciones', label: 'Observaciones', type: 'textarea' },
  ]

  return (
    <CrudView<HorarioPupilaje>
      service={horarioPupilajeService}
      queryKey={queryKeys.horarioPupilaje}
      label="horario"
      dateFilter={{
        label: 'Fecha',
        fieldOptions: [
          { value: 'dia', label: 'Día' },
          { value: 'createdAt', label: 'Registro' },
        ],
      }}
      searchable={false}
      columns={columns}
      fields={fields}
      fetchOne={(id) => horarioPupilajeService.findById({ id })}
      toFormValues={(item) => ({
        dia: item.dia,
        entrada: item.entrada,
        salida: item.salida,
        observaciones: item.observaciones,
      })}
      scopeParams={{ residente: scopeResidenteId }}
      defaults={{ residente: { id: scopeResidenteId } }}
    />
  )
}
