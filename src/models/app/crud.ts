import type { Rule } from 'antd/es/form'
import type { ReactNode } from 'react'

export type CrudFieldType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'switch'
  | 'select'
  | 'textarea'
  | 'date'
  | 'upload'

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
  disabled?: boolean
  rules?: Rule[]
}

export interface CrudFilter {
  name: string
  label: string
  options: CrudSelectOption[]
}

export interface CrudDateFilter {
  label: string
  fieldOptions?: CrudSelectOption[]
  fieldParam?: string
}

export interface CrudRangeFilter {
  label: string
  minParam: string
  maxParam: string
  prefix?: string
}

export interface CrudSummaryItem {
  label: string
  value: ReactNode
}

export interface RelationTab<Parent> {
  key: string
  label: string
  render: (parent: Parent) => ReactNode
}
