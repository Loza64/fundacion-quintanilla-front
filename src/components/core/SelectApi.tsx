import { Select, Spin } from 'antd'
import { useEffect, useMemo, useState } from 'react'

import { useFindAll } from '@/hooks/core/useFindAll'
import debounce from 'lodash.debounce'
import BaseEntity from '@/models/api/core/_BaseEntity'
import Service from '@/services/core/Service'

interface SelectApiProps<Entity extends BaseEntity> {
  service: Service<Entity>
  endpoint?: string
  querySearch?: (search: string) => Record<string, unknown>
  queryParams?: Record<string, unknown>
  queryKey: string | string[]
  value?: Entity | null
  onChange?: (value?: Entity) => void
  placeholder?: string
  renderOption?: (item: Entity) => React.ReactNode
}

export default function SelectApi<Entity extends BaseEntity>({
  service,
  endpoint,
  querySearch,
  queryParams,
  queryKey,
  value,
  onChange,
  placeholder = 'Select...',
  renderOption,
}: SelectApiProps<Entity>) {
  const [loaded, setLoaded] = useState(false)
  const [text, setText] = useState('')
  const [textDebounce, setTextDebounce] = useState('')

  const debounceText = useMemo(
    () => debounce((val: string) => setTextDebounce(val), 400),
    []
  )

  useEffect(() => {
    debounceText(text)
  }, [text, debounceText])

  useEffect(() => {
    return () => debounceText.cancel()
  }, [debounceText])

  const resolvedQuerySearch = useMemo(
    () => querySearch?.(textDebounce),
    [querySearch, textDebounce]
  )

  const { data: queryData, isLoading } = useFindAll({
    service,
    queryKey,
    endpoint,
    queryParams: {
      ...resolvedQuerySearch,
      ...queryParams,
    },
    enabled: loaded,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  })

  const options = queryData?.data ?? []

  // ─── Helpers ───────────────────────────────────────────────────────────────

  const getLabel = (item: Entity): React.ReactNode => {
    if (renderOption) return renderOption(item)
    return (item as Record<string, unknown>).name
      ? String((item as Record<string, unknown>).name)
      : String(item.id)
  }

  const findById = (id: unknown): Entity | undefined =>
    options.find((item) => String(item.id) === String(id))

  return (
    <Select
      labelInValue
      value={value ? { value: value.id, label: getLabel(value) } : undefined}
      onChange={(option) => onChange?.(findById(option?.value))}
      placeholder={placeholder}
      style={{ width: '100%' }}
      showSearch
      allowClear
      loading={isLoading}
      filterOption={false}
      onSearch={(val) => setText(val)}
      onDropdownVisibleChange={(open) => {
        if (open && !loaded) setLoaded(true)
      }}
      notFoundContent={isLoading ? <Spin size="small" /> : null}
    >
      {value && !findById(value.id) && (
        <Select.Option key={value.id} value={value.id}>
          {getLabel(value)}
        </Select.Option>
      )}

      {options.map((item) => (
        <Select.Option key={item.id} value={item.id}>
          {getLabel(item)}
        </Select.Option>
      ))}
    </Select>
  )
}
