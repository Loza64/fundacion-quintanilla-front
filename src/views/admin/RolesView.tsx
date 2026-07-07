import { useFindAll } from '@/hooks/core/useFindAll'
import { queryKeys } from '@/lib/queryClient'
import type Permissions from '@/models/api/entities/Permissions'
import type Role from '@/models/api/entities/Role'
import type { CrudField } from '@/models/app/crud'
import { permissionService, roleService } from '@/services/api'
import CrudView from '@/views/core/CrudView'
import { Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

export default function RolesView() {
  const { data: permsData } = useFindAll<Permissions>({
    queryKey: queryKeys.permissions,
    service: permissionService,
    queryParams: { page: 1, size: 200 },
  })

  const permissionOptions = (permsData?.data ?? []).map((permission) => ({
    label: `${permission.method} ${permission.path}`,
    value: permission.id ?? 0,
  }))

  const columns: ColumnsType<Role> = [
    { title: 'ID', dataIndex: 'id', key: 'id', align: 'center' },
    { title: 'Nombre', dataIndex: 'name', key: 'name', align: 'center' },
    {
      title: 'Estado',
      dataIndex: 'active',
      key: 'active',
      align: 'center',
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? 'Activo' : 'Inactivo'}
        </Tag>
      ),
    },
  ]

  const fields: CrudField[] = [
    { name: 'name', label: 'Nombre', required: true },
    { name: 'active', label: 'Activo', type: 'switch' },
    {
      name: 'permissions',
      label: 'Permisos',
      type: 'select',
      multiple: true,
      options: permissionOptions,
      placeholder: 'Selecciona permisos',
    },
  ]

  const toFormValues = (role: Role) => ({
    name: role.name,
    active: role.active ?? true,
    permissions: (role.permissions ?? []).map((permission) => permission.id),
  })

  const toPayload = (values: Record<string, unknown>) => {
    const { permissions, ...rest } = values
    const payload: Record<string, unknown> = { ...rest }
    if (Array.isArray(permissions)) {
      payload.permissions = permissions.map((id) => ({ id }))
    }
    return payload as Partial<Role>
  }

  return (
    <CrudView<Role>
      service={roleService}
      queryKey={queryKeys.roles}
      label="rol"
      searchable={false}
      columns={columns}
      fields={fields}
      toFormValues={toFormValues}
      toPayload={toPayload}
      fetchOne={(id) => roleService.findById({ id })}
    />
  )
}
