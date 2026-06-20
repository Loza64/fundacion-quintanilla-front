import { useFindAll } from '@/hooks/core/useFindAll'
import type AbstractService from '@/models/api/core/AbstractService'
import type BaseEntity from '@/models/api/core/_BaseEntity'
import { Table } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import type { ReactNode } from 'react'
import { useState } from 'react'

export interface CrudListViewProps<Entity extends BaseEntity> {
  service: AbstractService<Entity>
  queryKey: string | string[]
  columns: ColumnsType<Entity>
  defaultSize?: number
  toolbar?: ReactNode
  rowActions?: (record: Entity) => ReactNode
}

export default function CrudListView<Entity extends BaseEntity>({
  service,
  queryKey,
  columns,
  defaultSize = 15,
  toolbar,
  rowActions,
}: CrudListViewProps<Entity>) {
  const [params, setParams] = useState<Record<string, unknown>>({
    search: '',
    page: 1,
    size: defaultSize,
  })

  const { data, isLoading } = useFindAll<Entity>({
    queryKey,
    service,
    queryParams: params,
  })

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setParams((prev) => ({
      ...prev,
      page: pagination.current ?? 1,
      size: pagination.pageSize ?? prev.size,
    }))
  }

  const tableColumns: ColumnsType<Entity> = rowActions
    ? [
        ...columns,
        {
          title: 'Acciones',
          key: 'actions',
          align: 'center',
          render: (_, record) => rowActions(record),
        },
      ]
    : columns

  return (
    <div className="px-4 md:px-6">
      {toolbar}
      <Table<Entity>
        columns={tableColumns}
        dataSource={data?.data}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: data?.pagination.page ?? 1,
          pageSize: data?.pagination.pageSize,
          total: data?.pagination.total ?? 0,
          showSizeChanger: true,
          position: ['bottomCenter'],
        }}
        onChange={handleTableChange}
      />
    </div>
  )
}
