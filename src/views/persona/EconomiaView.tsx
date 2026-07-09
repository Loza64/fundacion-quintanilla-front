import { TIPO_ECONOMIA } from '@/enum/catalog'
import { queryKeys } from '@/lib/queryClient'
import type Economia from '@/models/api/entities/Economia'
import type { CrudField, CrudFilter } from '@/models/app/crud'
import { economiaService } from '@/services/api'
import { enumOptions } from '@/utils/options'
import CrudView from '@/views/core/CrudView'
import { Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

export default function EconomiaView({
  scopePersonaId,
}: {
  scopePersonaId: number
}) {
  const tipoOptions = enumOptions(TIPO_ECONOMIA)

  const columns: ColumnsType<Economia> = [
    { title: 'Ítem', dataIndex: 'item', key: 'item', align: 'center' },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      align: 'center',
      render: (tipo?: string) =>
        tipo ? (
          <Tag color={tipo === 'INGRESO' ? 'green' : 'red'}>{tipo}</Tag>
        ) : (
          '—'
        ),
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: 'cantidad',
      align: 'center',
      render: (cantidad?: number | string) =>
        cantidad != null ? `$${Number(cantidad).toFixed(2)}` : '—',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
  ]

  const fields: CrudField[] = [
    { name: 'item', label: 'Ítem', required: true },
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'select',
      options: tipoOptions,
    },
    { name: 'cantidad', label: 'Cantidad', type: 'number' },
    { name: 'descripcion', label: 'Descripción', type: 'textarea' },
  ]

  const filters: CrudFilter[] = [
    { name: 'tipo', label: 'Tipo', options: tipoOptions },
  ]

  return (
    <CrudView<Economia>
      service={economiaService}
      queryKey={queryKeys.economia}
      label="registro económico"
      dateFilter={{ label: 'Fecha' }}
      searchable={false}
      columns={columns}
      fields={fields}
      filters={filters}
      fetchOne={(id) => economiaService.findById({ id })}
      toFormValues={(item) => ({
        item: item.item,
        tipo: item.tipo,
        cantidad: item.cantidad != null ? Number(item.cantidad) : undefined,
        descripcion: item.descripcion,
      })}
      scopeParams={{ persona: scopePersonaId }}
      defaults={{ persona: { id: scopePersonaId } }}
    />
  )
}
