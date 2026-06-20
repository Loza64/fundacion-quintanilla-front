import CrudFormModal from '@/components/crud/CrudFormModal'
import useCrud from '@/hooks/core/useCrud'
import type AbstractService from '@/models/api/core/AbstractService'
import type BaseEntity from '@/models/api/core/_BaseEntity'
import type { CrudField } from '@/models/app/crud'
import CrudListView from '@/views/core/CrudListView'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { toast } from 'react-toastify'

export interface CrudViewProps<Entity extends BaseEntity> {
  service: AbstractService<Entity>
  queryKey: string | string[]
  label: string
  columns: ColumnsType<Entity>
  fields: CrudField[]
  toFormValues?: (entity: Entity) => Record<string, unknown>
  toPayload?: (values: Record<string, unknown>) => Partial<Entity>
  fetchOne?: (id: number) => Promise<Entity>
  canCreate?: boolean
  canEdit?: (record: Entity) => boolean
  canDelete?: (record: Entity) => boolean
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
  columns,
  fields,
  toFormValues,
  toPayload,
  fetchOne,
  canCreate = true,
  canEdit = () => true,
  canDelete = () => true,
}: CrudViewProps<Entity>) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [editing, setEditing] = useState<Entity | null>(null)
  const [initialValues, setInitialValues] = useState<Record<string, unknown>>()
  const [loadingOne, setLoadingOne] = useState(false)

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
    const payload = (toPayload ? toPayload(values) : values) as Partial<Entity>
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

  const rowActions = (record: Entity) => (
    <Space>
      {canEdit(record) && (
        <Button type="link" onClick={() => openEdit(record)}>
          Editar
        </Button>
      )}
      {canDelete(record) && (
        <Popconfirm
          title={`¿Eliminar este ${label}?`}
          okText="Sí"
          cancelText="No"
          onConfirm={() => handleDelete(record)}
        >
          <Button type="link" danger>
            Eliminar
          </Button>
        </Popconfirm>
      )}
    </Space>
  )

  const toolbar = canCreate ? (
    <div className="mb-3 flex justify-end">
      <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
        Nuevo
      </Button>
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
      />
      <CrudFormModal
        open={open}
        mode={mode}
        title={mode === 'create' ? `Nuevo ${label}` : `Editar ${label}`}
        fields={fields}
        initialValues={initialValues}
        confirmLoading={isCreating || isUpdating || loadingOne}
        onCancel={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  )
}
