import type { CrudField } from '@/models/app/crud'
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
} from 'antd'
import type { Rule } from 'antd/es/form'
import dayjs from 'dayjs'
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

const DATE_FORMAT = 'YYYY-MM-DD'

function renderInput(field: CrudField) {
  switch (field.type) {
    case 'password':
      return <Input.Password placeholder={field.placeholder} />
    case 'number':
      return <InputNumber className="w-full!" placeholder={field.placeholder} />
    case 'switch':
      return <Switch />
    case 'date':
      return <DatePicker className="w-full!" format="DD/MM/YYYY" />
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

  const dateFieldsKey = JSON.stringify(
    fields.filter((field) => field.type === 'date').map((field) => field.name)
  )

  useEffect(() => {
    if (!open) return
    form.resetFields()
    if (initialValues) {
      const dateFields: string[] = JSON.parse(dateFieldsKey)
      const values = { ...initialValues }
      for (const name of dateFields) {
        if (values[name]) values[name] = dayjs(values[name] as string)
      }
      form.setFieldsValue(values)
    }
  }, [open, initialValues, dateFieldsKey, form])

  const handleFinish = (values: Record<string, unknown>) => {
    const dateFields: string[] = JSON.parse(dateFieldsKey)
    const result = { ...values }
    for (const name of dateFields) {
      const value = result[name]
      if (dayjs.isDayjs(value)) result[name] = value.format(DATE_FORMAT)
    }
    onSubmit(result)
  }

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
      <Form form={form} layout="vertical" onFinish={handleFinish}>
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
