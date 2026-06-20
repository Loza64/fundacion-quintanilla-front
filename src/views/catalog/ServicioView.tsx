import { TIPO_SERVICIO } from '@/enum/catalog'
import { queryKeys } from '@/lib/queryClient'
import type Servicio from '@/models/api/entities/Servicio'
import type { CrudField, CrudFilter } from '@/models/app/crud'
import { servicioService } from '@/services/api'
import { enumOptions, humanize } from '@/utils/options'
import CrudView from '@/views/core/CrudView'
import { Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

export default function ServicioView() {
  const tipoOptions = enumOptions(TIPO_SERVICIO)

  const columns: ColumnsType<Servicio> = [
    { title: 'ID', dataIndex: 'id', key: 'id', align: 'center' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre', align: 'center' },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      align: 'center',
      render: (tipo?: string) =>
        tipo ? <Tag color="cyan">{humanize(tipo)}</Tag> : '—',
    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      key: 'precio',
      align: 'center',
      render: (precio?: number | string | null) =>
        precio != null && precio !== '' ? `$${Number(precio).toFixed(2)}` : '—',
    },
    { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
  ]

  const fields: CrudField[] = [
    { name: 'nombre', label: 'Nombre', required: true },
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'select',
      options: tipoOptions,
    },
    { name: 'precio', label: 'Precio', type: 'number' },
    { name: 'descripcion', label: 'Descripción', type: 'textarea' },
  ]

  const filters: CrudFilter[] = [
    { name: 'tipo', label: 'Tipo', options: tipoOptions },
  ]

  return (
    <CrudView<Servicio>
      service={servicioService}
      queryKey={queryKeys.servicios}
      label="servicio"
      columns={columns}
      fields={fields}
      filters={filters}
      toFormValues={(servicio) => ({
        nombre: servicio.nombre,
        tipo: servicio.tipo,
        precio: servicio.precio != null ? Number(servicio.precio) : undefined,
        descripcion: servicio.descripcion,
      })}
    />
  )
}
