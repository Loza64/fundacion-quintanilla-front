import { queryKeys } from '@/lib/queryClient'
import type Permissions from '@/models/api/entities/Permissions'
import type { CrudField } from '@/models/app/crud'
import { permissionService } from '@/services/api'
import CrudView from '@/views/core/CrudView'
import { Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

const METHOD_COLOR: Record<string, string> = {
  GET: 'blue',
  POST: 'green',
  PUT: 'orange',
  PATCH: 'gold',
  DELETE: 'red',
}

export default function PermissionsView() {
  const columns: ColumnsType<Permissions> = [
    { title: 'ID', dataIndex: 'id', key: 'id', align: 'center' },
    {
      title: 'Método',
      dataIndex: 'method',
      key: 'method',
      align: 'center',
      render: (method: string) => (
        <Tag color={METHOD_COLOR[method] ?? 'default'}>{method}</Tag>
      ),
    },
    { title: 'Ruta', dataIndex: 'path', key: 'path' },
    { title: 'Título', dataIndex: 'title', key: 'title', align: 'center' },
  ]

  const fields: CrudField[] = [
    { name: 'title', label: 'Título', required: true },
  ]

  return (
    <CrudView<Permissions>
      service={permissionService}
      queryKey={queryKeys.permissions}
      label="permiso"
      columns={columns}
      fields={fields}
      toFormValues={(permission) => ({ title: permission.title ?? '' })}
      toPayload={(values) => ({ title: values.title as string })}
      canCreate={false}
      canDelete={() => false}
    />
  )
}
