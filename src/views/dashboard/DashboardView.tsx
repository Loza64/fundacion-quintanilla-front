import { queryKeys } from '@/lib/queryClient'
import type User from '@/models/api/entities/User'
import { userService } from '@/services/api'
import CrudListView from '@/views/core/CrudListView'
import { Button, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'

export default function DashboardView() {
  const columns: ColumnsType<User> = [
    { title: 'ID', dataIndex: 'id', key: 'id', align: 'center' },
    {
      title: 'Usuario',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
    },
    { title: 'Nombres', dataIndex: 'name', key: 'name', align: 'center' },
    {
      title: 'Apellidos',
      dataIndex: 'surname',
      key: 'surname',
      align: 'center',
    },
    { title: 'Correo', dataIndex: 'email', key: 'email', align: 'center' },
    { title: 'Rol', dataIndex: ['role', 'name'], key: 'name', align: 'center' },
    {
      title: 'Acciones',
      key: 'actions',
      align: 'center',
      render: () => (
        <Space>
          <Button type="link" onClick={() => {}}>
            Ver
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <CrudListView<User>
      service={userService}
      queryKey={queryKeys.users}
      columns={columns}
    />
  )
}
