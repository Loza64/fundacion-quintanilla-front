import CrudDetailDrawer from '@/components/crud/CrudDetailDrawer'
import CrudFormModal from '@/components/crud/CrudFormModal'
import useCrud from '@/hooks/core/useCrud'
import useDebouncedValue from '@/hooks/core/useDebouncedValue'
import type AbstractService from '@/models/api/core/AbstractService'
import type BaseEntity from '@/models/api/core/_BaseEntity'
import type {
  CrudField,
  CrudFilter,
  CrudSummaryItem,
  RelationTab,
} from '@/models/app/crud'
import CrudListView from '@/views/core/CrudListView'
import { FilterOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Badge, Button, Input, Popover, Popconfirm, Select, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { toast } from 'react-toastify'

type FilterValue = string | number | undefined

export interface CrudViewProps<Entity extends BaseEntity> {
  service: AbstractService<Entity>
  queryKey: string | string[]
  label: string
  testId?: string
  columns: ColumnsType<Entity>
  fields: CrudField[]
  filters?: CrudFilter[]
  searchable?: boolean
  toFormValues?: (entity: Entity) => Record<string, unknown>
  toPayload?: (values: Record<string, unknown>) => Partial<Entity>
  fetchOne?: (id: number) => Promise<Entity>
  canCreate?: boolean
  canEdit?: (record: Entity) => boolean
  canDelete?: (record: Entity) => boolean
  scopeParams?: Record<string, unknown>
  defaults?: Record<string, unknown>
  relations?: RelationTab<Entity>[]
  summary?: (entity: Entity) => CrudSummaryItem[]
}

function errorMessage(error: unknown, fallback: string): string {
  const message = (
    error as { response?: { data?: { message?: string | string[] } } }
  )?.response?.data?.message
  if (Array.isArray(message)) return message.join(', ')
  return message ?? fallback
}

export default function CrudView<Entity extends BaseEntity>({
  service,
  queryKey,
  label,
  testId,
  columns,
  fields,
  filters = [],
  searchable = true,
  toFormValues,
  toPayload,
  fetchOne,
  canCreate = true,
  canEdit = () => true,
  canDelete = () => true,
  scopeParams,
  defaults,
  relations = [],
  summary,
}: CrudViewProps<Entity>) {
  const tid = testId ?? label.replace(/\s+/g, '-').toLowerCase()

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [editing, setEditing] = useState<Entity | null>(null)
  const [initialValues, setInitialValues] = useState<Record<string, unknown>>()
  const [loadingOne, setLoadingOne] = useState(false)
  const [filterValues, setFilterValues] = useState<Record<string, FilterValue>>(
    {}
  )
  const [searchInput, setSearchInput] = useState('')
  const [detailRecord, setDetailRecord] = useState<Entity | null>(null)

  const search = useDebouncedValue(searchInput, 350)

  const { create, update, softDelete, isCreating, isUpdating } =
    useCrud<Entity>({ service, queryKey })

  const openCreate = () => {
    setMode('create')
    setEditing(null)
    setInitialValues(undefined)
    setOpen(true)
  }

  const openEdit = async (record: Entity) => {
    setMode('edit')
    setEditing(record)
    if (fetchOne && record.id != null) {
      setLoadingOne(true)
      try {
        const full = await fetchOne(record.id)
        setInitialValues(
          toFormValues ? toFormValues(full) : (full as Record<string, unknown>)
        )
      } finally {
        setLoadingOne(false)
      }
    } else {
      setInitialValues(
        toFormValues
          ? toFormValues(record)
          : (record as Record<string, unknown>)
      )
    }
    setOpen(true)
  }

  const handleSubmit = async (values: Record<string, unknown>) => {
    const payload = {
      ...(toPayload ? toPayload(values) : values),
      ...defaults,
    } as Partial<Entity>
    try {
      if (mode === 'create') {
        await create({ payload: payload as Entity })
        toast.success(`${label} creado`)
      } else if (editing?.id != null) {
        await update({ id: String(editing.id), payload })
        toast.success(`${label} actualizado`)
      }
      setOpen(false)
    } catch (error) {
      toast.error(errorMessage(error, `No se pudo guardar el ${label}`))
    }
  }

  const handleDelete = async (record: Entity) => {
    if (record.id == null) return
    try {
      await softDelete({ id: String(record.id) })
      toast.success(`${label} eliminado`)
    } catch (error) {
      toast.error(errorMessage(error, `No se pudo eliminar el ${label}`))
    }
  }

  const hasDetail = relations.length > 0 || !!summary

  const rowActions = (record: Entity) => (
    <Space>
      {hasDetail && (
        <Button
          type="link"
          onClick={() => setDetailRecord(record)}
          data-testid={`${tid}-view-${record.id}`}
        >
          Ver
        </Button>
      )}
      {canEdit(record) && (
        <Button
          type="link"
          onClick={() => openEdit(record)}
          data-testid={`${tid}-edit-${record.id}`}
        >
          Editar
        </Button>
      )}
      {canDelete(record) && (
        <Popconfirm
          title={`¿Eliminar este ${label}?`}
          okText="Sí"
          cancelText="No"
          onConfirm={() => handleDelete(record)}
          okButtonProps={{
            'data-testid': `${tid}-delete-confirm`,
          }}
        >
          <Button type="link" danger data-testid={`${tid}-delete-${record.id}`}>
            Eliminar
          </Button>
        </Popconfirm>
      )}
    </Space>
  )

  const extraParams: Record<string, unknown> = { ...scopeParams }
  if (searchable && search.trim()) extraParams.search = search.trim()
  for (const [key, value] of Object.entries(filterValues)) {
    if (value !== undefined && value !== '') extraParams[key] = value
  }

  const activeFilters = Object.values(filterValues).filter(
    (value) => value !== undefined && value !== ''
  ).length

  const filtersPanel = (
    <div className="flex w-60 flex-col gap-3">
      {filters.map((filter) => (
        <div key={filter.name} className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-500">
            {filter.label}
          </span>
          <Select<FilterValue>
            placeholder="Todos"
            options={filter.options}
            value={filterValues[filter.name]}
            onChange={(value) =>
              setFilterValues((prev) => ({ ...prev, [filter.name]: value }))
            }
            showSearch
            optionFilterProp="label"
            allowClear
            data-testid={`${tid}-filter-${filter.name}`}
          />
        </div>
      ))}
      {activeFilters > 0 && (
        <Button size="small" type="text" onClick={() => setFilterValues({})}>
          Limpiar filtros
        </Button>
      )}
    </div>
  )

  const hasToolbar = searchable || filters.length > 0 || canCreate

  const toolbar = hasToolbar ? (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <Space wrap>
        {searchable && (
          <Input
            allowClear
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder={`Buscar ${label}...`}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="w-full! sm:w-80!"
            data-testid={`${tid}-search`}
          />
        )}
        {filters.length > 0 && (
          <Popover
            content={filtersPanel}
            trigger="click"
            placement="bottomLeft"
          >
            <Badge count={activeFilters} size="small">
              <Button icon={<FilterOutlined />} data-testid={`${tid}-filters`}>
                Filtros
              </Button>
            </Badge>
          </Popover>
        )}
      </Space>
      {canCreate && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreate}
          data-testid={`${tid}-new`}
        >
          Nuevo
        </Button>
      )}
    </div>
  ) : null

  return (
    <>
      <CrudListView<Entity>
        service={service}
        queryKey={queryKey}
        columns={columns}
        toolbar={toolbar}
        rowActions={rowActions}
        extraParams={extraParams}
      />
      <CrudFormModal
        open={open}
        mode={mode}
        testId={tid}
        title={mode === 'create' ? `Nuevo ${label}` : `Editar ${label}`}
        fields={fields}
        initialValues={initialValues}
        confirmLoading={isCreating || isUpdating || loadingOne}
        onCancel={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
      {hasDetail && (
        <CrudDetailDrawer<Entity>
          open={!!detailRecord}
          title={`Detalle de ${label}`}
          record={detailRecord}
          relations={relations}
          summary={summary}
          onClose={() => setDetailRecord(null)}
        />
      )}
    </>
  )
}
