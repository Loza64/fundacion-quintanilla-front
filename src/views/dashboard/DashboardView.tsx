//import { searchRecoil } from "@/constants/recoil";

//import useRecoil from "@/hooks/useRecoil";
import { useFindAll } from '@/hooks/core/useFindAll'
import { queryKeys } from '@/lib/queryClient'
import type User from '@/models/api/entities/User'
import { userService } from '@/services/api'
import { Table, Button, Space } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { useMemo, useState } from 'react'

export default function DashboardView() {
  const [params, setParams] = useState<Record<string, unknown>>({
    search: '',
    page: 1,
    size: 15,
  })

  const { data, isLoading } = useFindAll({
    queryKey: queryKeys.users,
    service: userService,
    queryParams: params,
  })

  //const [search] = useRecoil<string | undefined>(searchRecoil)
  //console.log(search)

  const response = useMemo(() => data, [data])

  console.log(response)

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setParams((prev) => ({
      ...prev,
      page: (pagination.current ?? 1) - 1,
      size: pagination.pageSize ?? prev.size,
    }))
  }

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
    <div>
      <Table<User>
        columns={columns}
        dataSource={response?.data}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: response?.pagination.page ?? 1,
          pageSize: response?.pagination.pageSize,
          total: response?.pagination.total ?? 0,
          showSizeChanger: true,
          position: ['bottomCenter'],
        }}
        onChange={handleTableChange}
      />
    </div>
  )
}
