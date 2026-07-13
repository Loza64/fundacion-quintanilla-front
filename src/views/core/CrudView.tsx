import CrudDetailDrawer from '@/components/crud/CrudDetailDrawer'
import CrudFormModal from '@/components/crud/CrudFormModal'
import useCrud from '@/hooks/core/useCrud'
import useDebouncedValue from '@/hooks/core/useDebouncedValue'
import { useSession } from '@/hooks/useSession'
import {
  canCreateResource,
  canDeleteResource,
  canManageDeleted,
} from '@/utils/permission.app'
import type AbstractService from '@/models/api/core/AbstractService'
import type BaseEntity from '@/models/api/core/_BaseEntity'
import type {
  CrudDateFilter,
  CrudField,
  CrudFilter,
  CrudRangeFilter,
  CrudSummaryItem,
  RelationTab,
} from '@/models/app/crud'
import type AvatarUpload from '@/models/photos/AvatarUpload'
import { uploadService } from '@/services/api'
import CrudListView from '@/views/core/CrudListView'
import {
  DeleteOutlined,
  DownloadOutlined,
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import {
  Badge,
  Button,
  DatePicker,
  Input,
  InputNumber,
  Popover,
  Popconfirm,
  Select,
  Space,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { Dayjs } from 'dayjs'
import { useState } from 'react'
import { toast } from 'react-toastify'

const { RangePicker } = DatePicker

type FilterValue = string | number | undefined

export interface CrudViewProps<Entity extends BaseEntity> {
  service: AbstractService<Entity>
  queryKey: string | string[]
  label: string
  testId?: string
  columns: ColumnsType<Entity>
  fields: CrudField[]
  filters?: CrudFilter[]
  dateFilter?: CrudDateFilter
  rangeFilters?: CrudRangeFilter[]
  searchable?: boolean
  toFormValues?: (entity: Entity) => Record<string, unknown>
  toPayload?: (values: Record<string, unknown>) => Partial<Entity>
  fetchOne?: (id: number) => Promise<Entity>
  canCreate?: boolean
  canEdit?: (record: Entity) => boolean
  canDelete?: (record: Entity) => boolean
  exportable?: boolean
  restorable?: boolean
  defaultSort?: string
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
  dateFilter,
  rangeFilters = [],
  searchable = true,
  toFormValues,
  toPayload,
  fetchOne,
  canCreate = true,
  canEdit = () => true,
  canDelete = () => true,
  exportable = false,
  restorable = true,
  defaultSort,
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
  const [isExporting, setIsExporting] = useState(false)
  const [showDeleted, setShowDeleted] = useState(false)
  const [dateField, setDateField] = useState<string | undefined>(
    dateFilter?.fieldOptions?.[0]?.value as string | undefined
  )
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null)
  const [rangeValues, setRangeValues] = useState<
    Record<string, { min?: number; max?: number }>
  >({})

  const { profile } = useSession()
  const canSeeDeleted =
    restorable && canManageDeleted(profile, service.resource)
  const canCreateHere =
    canCreate && canCreateResource(profile, service.resource)
  const canDeleteHere = canDeleteResource(profile, service.resource)

  const search = useDebouncedValue(searchInput, 350)

  const { create, update, softDelete, restore, isCreating, isUpdating } =
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

  const resolveUploads = async (values: Record<string, unknown>) => {
    const resolved = { ...values }
    for (const field of fields) {
      if (field.type !== 'upload') continue
      const value = values[field.name] as AvatarUpload | null | undefined
      if (value?.originFileObj) {
        const uploaded = await uploadService.upload(value.originFileObj)
        resolved[field.name] = { id: uploaded.id }
      } else if (value?.id) {
        resolved[field.name] = { id: value.id }
      } else {
        delete resolved[field.name]
      }
    }
    return resolved
  }

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      const resolved = await resolveUploads(values)
      const payload = {
        ...(toPayload ? toPayload(resolved) : resolved),
        ...defaults,
      } as Partial<Entity>
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

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await service.exportExcel({ filename: `${tid}.xlsx` })
    } catch (error) {
      toast.error(errorMessage(error, `No se pudo exportar ${label}`))
    } finally {
      setIsExporting(false)
    }
  }

  const handleRestore = async (record: Entity) => {
    if (record.id == null) return
    try {
      await restore({ id: String(record.id) })
      toast.success(`${label} restaurado`)
    } catch (error) {
      toast.error(errorMessage(error, `No se pudo restaurar el ${label}`))
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
      {showDeleted ? (
        <Popconfirm
          title={`¿Restaurar este ${label}?`}
          okText="Sí"
          cancelText="No"
          onConfirm={() => handleRestore(record)}
          okButtonProps={{ 'data-testid': `${tid}-restore-confirm` }}
        >
          <Button type="link" data-testid={`${tid}-restore-${record.id}`}>
            Restaurar
          </Button>
        </Popconfirm>
      ) : (
        <>
          {canEdit(record) && (
            <Button
              type="link"
              onClick={() => openEdit(record)}
              data-testid={`${tid}-edit-${record.id}`}
            >
              Editar
            </Button>
          )}
          {canDelete(record) && canDeleteHere && (
            <Popconfirm
              title={`¿Eliminar este ${label}?`}
              okText="Sí"
              cancelText="No"
              onConfirm={() => handleDelete(record)}
              okButtonProps={{
                'data-testid': `${tid}-delete-confirm`,
              }}
            >
              <Button
                type="link"
                danger
                data-testid={`${tid}-delete-${record.id}`}
              >
                Eliminar
              </Button>
            </Popconfirm>
          )}
        </>
      )}
    </Space>
  )

  const extraParams: Record<string, unknown> = { ...scopeParams }
  if (searchable && search.trim()) extraParams.search = search.trim()
  if (showDeleted) extraParams.isDeleted = true
  for (const [key, value] of Object.entries(filterValues)) {
    if (value !== undefined && value !== '') extraParams[key] = value
  }
  if (dateFilter && dateRange?.[0] && dateRange?.[1]) {
    extraParams.from = dateRange[0].format('YYYY-MM-DD')
    extraParams.to = dateRange[1].format('YYYY-MM-DD')
    if (dateFilter.fieldOptions?.length) {
      extraParams[dateFilter.fieldParam ?? 'type'] = dateField
    }
  }
  for (const range of rangeFilters) {
    const value = rangeValues[range.minParam]
    if (value?.min != null) extraParams[range.minParam] = value.min
    if (value?.max != null) extraParams[range.maxParam] = value.max
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

  const hasToolbar =
    searchable ||
    filters.length > 0 ||
    !!dateFilter ||
    rangeFilters.length > 0 ||
    canCreateHere ||
    exportable ||
    canSeeDeleted

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
        {dateFilter && (
          <Space.Compact>
            {dateFilter.fieldOptions?.length ? (
              <Select<string>
                value={dateField}
                onChange={setDateField}
                options={dateFilter.fieldOptions}
                className="min-w-40!"
                data-testid={`${tid}-datefield`}
              />
            ) : null}
            <RangePicker
              value={dateRange}
              onChange={(dates) =>
                setDateRange(
                  dates?.[0] && dates?.[1] ? [dates[0], dates[1]] : null
                )
              }
              format="DD/MM/YYYY"
              placeholder={['Desde', 'Hasta']}
              data-testid={`${tid}-daterange`}
            />
          </Space.Compact>
        )}
        {rangeFilters.map((range) => (
          <Space.Compact key={range.minParam}>
            <InputNumber
              value={rangeValues[range.minParam]?.min}
              onChange={(value) =>
                setRangeValues((prev) => ({
                  ...prev,
                  [range.minParam]: {
                    ...prev[range.minParam],
                    min: value ?? undefined,
                  },
                }))
              }
              prefix={range.prefix}
              placeholder={`${range.label} mín`}
              className="w-32!"
              data-testid={`${tid}-range-${range.minParam}`}
            />
            <InputNumber
              value={rangeValues[range.minParam]?.max}
              onChange={(value) =>
                setRangeValues((prev) => ({
                  ...prev,
                  [range.minParam]: {
                    ...prev[range.minParam],
                    max: value ?? undefined,
                  },
                }))
              }
              prefix={range.prefix}
              placeholder={`${range.label} máx`}
              className="w-32!"
              data-testid={`${tid}-range-${range.maxParam}`}
            />
          </Space.Compact>
        ))}
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
        {canSeeDeleted && (
          <Button
            type={showDeleted ? 'primary' : 'default'}
            icon={showDeleted ? <ReloadOutlined /> : <DeleteOutlined />}
            onClick={() => setShowDeleted((value) => !value)}
            data-testid={`${tid}-toggle-deleted`}
          >
            {showDeleted ? 'Ver activos' : 'Ver eliminados'}
          </Button>
        )}
      </Space>
      <Space wrap>
        {exportable && (
          <Button
            icon={<DownloadOutlined />}
            loading={isExporting}
            onClick={handleExport}
            data-testid={`${tid}-export`}
          >
            Exportar Excel
          </Button>
        )}
        {canCreateHere && !showDeleted && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreate}
            data-testid={`${tid}-new`}
          >
            Nuevo
          </Button>
        )}
      </Space>
    </div>
  ) : null

  return (
    <>
      <CrudListView<Entity>
        service={service}
        queryKey={queryKey}
        columns={columns}
        defaultSort={defaultSort}
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
