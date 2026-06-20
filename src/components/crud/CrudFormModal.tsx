import type { CrudField } from '@/models/app/crud'
import { Form, Input, InputNumber, Modal, Select, Switch } from 'antd'
import type { Rule } from 'antd/es/form'
import { useEffect } from 'react'

export interface CrudFormModalProps {
  open: boolean
  title: string
  fields: CrudField[]
  mode: 'create' | 'edit'
  initialValues?: Record<string, unknown>
  confirmLoading?: boolean
  onCancel: () => void
  onSubmit: (values: Record<string, unknown>) => void
}

function renderInput(field: CrudField) {
  switch (field.type) {
    case 'password':
      return <Input.Password placeholder={field.placeholder} />
    case 'number':
      return <InputNumber className="w-full!" placeholder={field.placeholder} />
    case 'switch':
      return <Switch />
    case 'textarea':
      return <Input.TextArea rows={3} placeholder={field.placeholder} />
    case 'select':
      return (
        <Select
          placeholder={field.placeholder}
          options={field.options}
          mode={field.multiple ? 'multiple' : undefined}
          showSearch
          optionFilterProp="label"
          allowClear
        />
      )
    default:
      return <Input placeholder={field.placeholder} />
  }
}

export default function CrudFormModal({
  open,
  title,
  fields,
  mode,
  initialValues,
  confirmLoading,
  onCancel,
  onSubmit,
}: CrudFormModalProps) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (!open) return
    form.resetFields()
    if (initialValues) form.setFieldsValue(initialValues)
  }, [open, initialValues, form])

  const visibleFields = fields.filter(
    (field) => !(mode === 'edit' && field.hideOnEdit)
  )

  return (
    <Modal
      open={open}
      title={title}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Guardar"
      cancelText="Cancelar"
      confirmLoading={confirmLoading}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        {visibleFields.map((field) => {
          const rules: Rule[] = [
            ...(field.required
              ? [{ required: true, message: `${field.label} es obligatorio` }]
              : []),
            ...(field.type === 'email' ? [{ type: 'email' as const }] : []),
            ...(field.rules ?? []),
          ]

          return (
            <Form.Item
              key={field.name}
              name={field.name}
              label={field.label}
              valuePropName={field.type === 'switch' ? 'checked' : 'value'}
              rules={rules}
            >
              {renderInput(field)}
            </Form.Item>
          )
        })}
      </Form>
    </Modal>
  )
}
