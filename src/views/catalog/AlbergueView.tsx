import { useFindAll } from '@/hooks/core/useFindAll'
import { queryKeys } from '@/lib/queryClient'
import type Albergue from '@/models/api/entities/Albergue'
import type User from '@/models/api/entities/User'
import type {
  CrudField,
  CrudFilter,
  CrudSummaryItem,
  RelationTab,
} from '@/models/app/crud'
import { TIPO_ALBERGUE } from '@/enum/catalog'
import { albergueService, userService } from '@/services/api'
import { enumOptions, humanize } from '@/utils/options'
import CrudView from '@/views/core/CrudView'
import HabitacionView from '@/views/catalog/HabitacionView'
import ReciboView from '@/views/finanzas/ReciboView'
import { Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

export default function AlbergueView() {
  const { data: usersData } = useFindAll<User>({
    queryKey: queryKeys.users,
    service: userService,
    queryParams: { page: 1, size: 100 },
  })

  const encargadoOptions = (usersData?.data ?? []).map((user) => ({
    label: `${user.name} ${user.surname} (${user.username})`,
    value: user.id ?? 0,
  }))

  const tipoOptions = enumOptions(TIPO_ALBERGUE)

  const columns: ColumnsType<Albergue> = [
    { title: 'ID', dataIndex: 'id', key: 'id', align: 'center' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre', align: 'center' },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      align: 'center',
      render: (tipo: string) => <Tag color="blue">{humanize(tipo)}</Tag>,
    },
    {
      title: 'Capacidad',
      dataIndex: 'capacidad_maxima',
      key: 'capacidad_maxima',
      align: 'center',
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
      align: 'center',
    },
    { title: 'Correo', dataIndex: 'correo', key: 'correo', align: 'center' },
  ]

  const fields: CrudField[] = [
    { name: 'nombre', label: 'Nombre', required: true },
    { name: 'direccion', label: 'Dirección', required: true },
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'select',
      required: true,
      options: tipoOptions,
    },
    {
      name: 'capacidad_maxima',
      label: 'Capacidad máxima',
      type: 'number',
      required: true,
    },
    { name: 'telefono', label: 'Teléfono' },
    { name: 'correo', label: 'Correo', type: 'email' },
    {
      name: 'encargado',
      label: 'Encargado',
      type: 'select',
      options: encargadoOptions,
      placeholder: 'Sin encargado',
    },
  ]

  const filters: CrudFilter[] = [
    { name: 'tipo', label: 'Tipo', options: tipoOptions },
  ]

  const toFormValues = (albergue: Albergue) => ({
    nombre: albergue.nombre,
    direccion: albergue.direccion,
    tipo: albergue.tipo,
    capacidad_maxima: albergue.capacidad_maxima,
    telefono: albergue.telefono,
    correo: albergue.correo,
    encargado: albergue.encargado?.id,
  })

  const toPayload = (values: Record<string, unknown>) => {
    const { encargado, ...rest } = values
    const payload: Record<string, unknown> = { ...rest }
    payload.encargado = encargado != null ? { id: encargado } : null
    return payload as Partial<Albergue>
  }

  const summary = (albergue: Albergue): CrudSummaryItem[] => [
    { label: 'Nombre', value: albergue.nombre },
    { label: 'Tipo', value: humanize(albergue.tipo) },
    { label: 'Dirección', value: albergue.direccion },
    { label: 'Capacidad', value: albergue.capacidad_maxima },
    { label: 'Teléfono', value: albergue.telefono || '—' },
    { label: 'Correo', value: albergue.correo || '—' },
    {
      label: 'Encargado',
      value: albergue.encargado
        ? `${albergue.encargado.name} ${albergue.encargado.surname}`
        : '—',
    },
  ]

  const relations: RelationTab<Albergue>[] = [
    {
      key: 'habitaciones',
      label: 'Habitaciones',
      render: (albergue) => <HabitacionView scopeAlbergueId={albergue.id} />,
    },
    {
      key: 'recibos',
      label: 'Recibos',
      render: (albergue) => <ReciboView scopeAlbergueId={albergue.id} />,
    },
  ]

  return (
    <CrudView<Albergue>
      service={albergueService}
      queryKey={queryKeys.albergues}
      label="albergue"
      columns={columns}
      fields={fields}
      filters={filters}
      toFormValues={toFormValues}
      toPayload={toPayload}
      fetchOne={(id) => albergueService.findById({ id })}
      summary={summary}
      relations={relations}
    />
  )
}
