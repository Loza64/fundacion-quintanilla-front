import type { Rule } from 'antd/es/form'

export type CrudFieldType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'switch'
  | 'select'
  | 'textarea'

export interface CrudSelectOption {
  label: string
  value: string | number
}

export interface CrudField {
  name: string
  label: string
  type?: CrudFieldType
  required?: boolean
  placeholder?: string
  options?: CrudSelectOption[]
  multiple?: boolean
  hideOnEdit?: boolean
  rules?: Rule[]
}
