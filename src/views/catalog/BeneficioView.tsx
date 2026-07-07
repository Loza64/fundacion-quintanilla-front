import { TIPO_BENEFICIO } from '@/enum/catalog'
import { queryKeys } from '@/lib/queryClient'
import type Beneficio from '@/models/api/entities/Beneficio'
import type { CrudField, CrudFilter } from '@/models/app/crud'
import { beneficioService } from '@/services/api'
import { enumOptions, humanize } from '@/utils/options'
import CrudView from '@/views/core/CrudView'
import { Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

export default function BeneficioView() {
  const tipoOptions = enumOptions(TIPO_BENEFICIO)

  const columns: ColumnsType<Beneficio> = [
    { title: 'ID', dataIndex: 'id', key: 'id', align: 'center' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre', align: 'center' },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      align: 'center',
      render: (tipo: string) => <Tag color="purple">{humanize(tipo)}</Tag>,
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
  ]

  const fields: CrudField[] = [
    { name: 'nombre', label: 'Nombre', required: true },
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'select',
      required: true,
      options: tipoOptions,
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      required: true,
    },
  ]

  const filters: CrudFilter[] = [
    { name: 'tipo', label: 'Tipo', options: tipoOptions },
  ]

  return (
    <CrudView<Beneficio>
      service={beneficioService}
      queryKey={queryKeys.beneficios}
      label="beneficio"
      columns={columns}
      fields={fields}
      filters={filters}
      toFormValues={(beneficio) => ({
        nombre: beneficio.nombre,
        tipo: beneficio.tipo,
        descripcion: beneficio.descripcion,
      })}
    />
  )
}
