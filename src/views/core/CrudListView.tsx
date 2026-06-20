import { useFindAll } from '@/hooks/core/useFindAll'
import type AbstractService from '@/models/api/core/AbstractService'
import type BaseEntity from '@/models/api/core/_BaseEntity'
import { Table } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { useState } from 'react'

export interface CrudListViewProps<Entity extends BaseEntity> {
  service: AbstractService<Entity>
  queryKey: string | string[]
  columns: ColumnsType<Entity>
  defaultSize?: number
}

export default function CrudListView<Entity extends BaseEntity>({
  service,
  queryKey,
  columns,
  defaultSize = 15,
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

  return (
    <Table<Entity>
      columns={columns}
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
  )
}
