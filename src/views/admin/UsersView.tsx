import { useFindAll } from '@/hooks/core/useFindAll'
import { useSession } from '@/hooks/useSession'
import { roles } from '@/enum/role'
import { queryKeys } from '@/lib/queryClient'
import type Role from '@/models/api/entities/Role'
import type User from '@/models/api/entities/User'
import type { CrudField, CrudFilter } from '@/models/app/crud'
import { roleService, userService } from '@/services/api'
import CrudView from '@/views/core/CrudView'
import { Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

export default function UsersView() {
  const { profile } = useSession()
  const isSuperAdmin = profile?.role?.name === roles.superAdmin

  const { data: rolesData } = useFindAll<Role>({
    queryKey: queryKeys.roles,
    service: roleService,
    queryParams: { page: 1, size: 100 },
  })

  const allRoles = rolesData?.data ?? []
  const encargadoRoleId = allRoles.find((role) => role.name === 'ENCARGADO')?.id

  // El SUPER_ADMIN gestiona todos los usuarios; el ADMIN solo los ENCARGADO.
  const roleOptions = (
    isSuperAdmin
      ? allRoles
      : allRoles.filter((role) => role.name === 'ENCARGADO')
  ).map((role) => ({ label: role.name, value: role.id ?? 0 }))

  const columns: ColumnsType<User> = [
    { title: 'ID', dataIndex: 'id', key: 'id', align: 'center' },
    {
      title: 'Usuario',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
    },
    { title: 'Nombres', dataIndex: 'name', key: 'name', align: 'center' },
    {
      title: 'Apellidos',
      dataIndex: 'surname',
      key: 'surname',
      align: 'center',
    },
    { title: 'Correo', dataIndex: 'email', key: 'email', align: 'center' },
    { title: 'Rol', dataIndex: ['role', 'name'], key: 'role', align: 'center' },
    {
      title: 'Estado',
      dataIndex: 'blocked',
      key: 'blocked',
      align: 'center',
      render: (blocked: boolean) => (
        <Tag color={blocked ? 'red' : 'green'}>
          {blocked ? 'Bloqueado' : 'Activo'}
        </Tag>
      ),
    },
  ]

  const fields: CrudField[] = [
    { name: 'username', label: 'Usuario', required: true },
    { name: 'name', label: 'Nombres', required: true },
    { name: 'surname', label: 'Apellidos', required: true },
    { name: 'email', label: 'Correo', type: 'email', required: true },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password',
      required: true,
      hideOnEdit: true,
      rules: [{ min: 6, message: 'Mínimo 6 caracteres' }],
    },
    // El admin solo crea ENCARGADO (rol fijo); el super admin elige el rol.
    ...(isSuperAdmin
      ? [
          {
            name: 'role',
            label: 'Rol',
            type: 'select' as const,
            required: true,
            options: roleOptions,
            placeholder: 'Selecciona un rol',
          },
        ]
      : []),
    { name: 'blocked', label: 'Bloqueado', type: 'switch' },
  ]

  const filters: CrudFilter[] = [
    ...(isSuperAdmin
      ? [{ name: 'role', label: 'Rol', options: roleOptions }]
      : []),
    {
      name: 'blocked',
      label: 'Estado',
      options: [
        { label: 'Activo', value: 'false' },
        { label: 'Bloqueado', value: 'true' },
      ],
    },
  ]

  const toFormValues = (user: User) => ({
    username: user.username,
    name: user.name,
    surname: user.surname,
    email: user.email,
    ...(isSuperAdmin ? { role: user.role?.id } : {}),
    blocked: user.blocked ?? false,
  })

  const toPayload = (values: Record<string, unknown>) => {
    const { role, password, ...rest } = values
    const payload: Record<string, unknown> = { ...rest }
    if (role != null) payload.role = { id: role }
    if (password) payload.password = password
    return payload as Partial<User>
  }

  const isSelf = (user: User) => user.id === profile?.id

  return (
    <CrudView<User>
      service={userService}
      queryKey={queryKeys.users}
      label="usuario"
      columns={columns}
      fields={fields}
      filters={filters}
      toFormValues={toFormValues}
      toPayload={toPayload}
      canEdit={(user) => !isSelf(user)}
      canDelete={(user) => !isSelf(user)}
      scopeParams={
        isSuperAdmin || encargadoRoleId == null
          ? undefined
          : { role: encargadoRoleId }
      }
      defaults={
        isSuperAdmin || encargadoRoleId == null
          ? undefined
          : { role: { id: encargadoRoleId } }
      }
    />
  )
}
