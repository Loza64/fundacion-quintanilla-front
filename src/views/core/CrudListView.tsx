import { useFindAll } from '@/hooks/core/useFindAll'
import type AbstractService from '@/models/api/core/AbstractService'
import type BaseEntity from '@/models/api/core/_BaseEntity'
import { Table } from 'antd'
import type {
  ColumnsType,
  ColumnType,
  TablePaginationConfig,
} from 'antd/es/table'
import type { SortOrder, SorterResult } from 'antd/es/table/interface'
import type { ReactNode } from 'react'
import { useState } from 'react'

export interface CrudListViewProps<Entity extends BaseEntity> {
  service: AbstractService<Entity>
  queryKey: string | string[]
  columns: ColumnsType<Entity>
  defaultSize?: number
  defaultSort?: string
  toolbar?: ReactNode
  rowActions?: (record: Entity) => ReactNode
  extraParams?: Record<string, unknown>
}

const toSortParam = (field: string, order: SortOrder): string | undefined => {
  if (!order) return undefined
  return `${field}:${order === 'ascend' ? 'asc' : 'desc'}`
}

export default function CrudListView<Entity extends BaseEntity>({
  service,
  queryKey,
  columns,
  defaultSize = 15,
  defaultSort,
  toolbar,
  rowActions,
  extraParams,
}: CrudListViewProps<Entity>) {
  const [pagination, setPagination] = useState({ page: 1, size: defaultSize })
  const [userSort, setUserSort] = useState<string>()

  const extraKey = JSON.stringify(extraParams ?? {})
  const [prevExtraKey, setPrevExtraKey] = useState(extraKey)
  if (extraKey !== prevExtraKey) {
    setPrevExtraKey(extraKey)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const sort = userSort
    ? /^id:/.test(userSort)
      ? userSort
      : `${userSort},id:asc`
    : defaultSort

  const queryParams = {
    ...(extraParams ?? {}),
    ...(sort ? { sort } : {}),
    page: pagination.page,
    size: pagination.size,
  }

  const { data, isLoading } = useFindAll<Entity>({
    queryKey,
    service,
    queryParams,
  })

  const handleTableChange = (
    config: TablePaginationConfig,
    _filters: unknown,
    sorter: SorterResult<Entity> | SorterResult<Entity>[],
    extra: { action: 'paginate' | 'sort' | 'filter' }
  ) => {
    if (extra.action === 'sort') {
      const single = Array.isArray(sorter) ? sorter[0] : sorter
      const rawField = single?.field
      const field = Array.isArray(rawField)
        ? String(rawField[rawField.length - 1])
        : rawField != null
          ? String(rawField)
          : undefined
      setUserSort(field ? toSortParam(field, single?.order ?? null) : undefined)
      setPagination((prev) => ({ ...prev, page: 1 }))
      return
    }
    setPagination({
      page: config.current ?? 1,
      size: config.pageSize ?? defaultSize,
    })
  }

  const sortableColumns: ColumnsType<Entity> = columns.map((col) => {
    const column = col as ColumnType<Entity>
    const dataIndex = column.dataIndex
    const field = Array.isArray(dataIndex)
      ? dataIndex[dataIndex.length - 1]
      : dataIndex
    if (typeof field !== 'string' || column.sorter !== undefined) return col
    return {
      ...column,
      key: column.key ?? field,
      sorter: true,
      sortDirections: ['ascend', 'descend'] as SortOrder[],
    }
  })

  const tableColumns: ColumnsType<Entity> = rowActions
    ? [
        ...sortableColumns,
        {
          title: 'Acciones',
          key: 'actions',
          align: 'center',
          render: (_, record) => rowActions(record),
        },
      ]
    : sortableColumns

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
