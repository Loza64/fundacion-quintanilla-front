import { ESTADO_CIVIL, PARENTESCO, SEXO } from '@/enum/catalog'
import { queryKeys } from '@/lib/queryClient'
import type GrupoFamiliar from '@/models/api/entities/GrupoFamiliar'
import type { CrudField, CrudFilter } from '@/models/app/crud'
import { grupoFamiliarService } from '@/services/api'
import { enumOptions, humanize } from '@/utils/options'
import CrudView from '@/views/core/CrudView'
import type { ColumnsType } from 'antd/es/table'

export default function GrupoFamiliarView({
  scopePersonaId,
}: {
  scopePersonaId: number
}) {
  const parentescoOptions = enumOptions(PARENTESCO)

  const columns: ColumnsType<GrupoFamiliar> = [
    { title: 'Nombres', dataIndex: 'nombres', key: 'nombres', align: 'center' },
    {
      title: 'Apellidos',
      dataIndex: 'apellidos',
      key: 'apellidos',
      align: 'center',
    },
    { title: 'DUI', dataIndex: 'dui', key: 'dui', align: 'center' },
    {
      title: 'Parentesco',
      dataIndex: 'parentesco',
      key: 'parentesco',
      align: 'center',
      render: (value?: string) => (value ? humanize(value) : '—'),
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
      align: 'center',
    },
  ]

  const fields: CrudField[] = [
    { name: 'nombres', label: 'Nombres', required: true },
    { name: 'apellidos', label: 'Apellidos', required: true },
    { name: 'dui', label: 'DUI' },
    {
      name: 'parentesco',
      label: 'Parentesco',
      type: 'select',
      options: parentescoOptions,
    },
    { name: 'fecha_nacimiento', label: 'Fecha de nacimiento', type: 'date' },
    { name: 'sexo', label: 'Sexo', type: 'select', options: enumOptions(SEXO) },
    {
      name: 'estado_civil',
      label: 'Estado civil',
      type: 'select',
      options: enumOptions(ESTADO_CIVIL),
    },
    { name: 'telefono', label: 'Teléfono' },
  ]

  const filters: CrudFilter[] = [
    { name: 'parentesco', label: 'Parentesco', options: parentescoOptions },
  ]

  return (
    <CrudView<GrupoFamiliar>
      service={grupoFamiliarService}
      queryKey={queryKeys.grupoFamiliar}
      label="familiar"
      searchable={false}
      columns={columns}
      fields={fields}
      filters={filters}
      fetchOne={(id) => grupoFamiliarService.findById({ id })}
      toFormValues={(item) => ({
        nombres: item.nombres,
        apellidos: item.apellidos,
        dui: item.dui,
        parentesco: item.parentesco,
        fecha_nacimiento: item.fecha_nacimiento,
        sexo: item.sexo,
        estado_civil: item.estado_civil,
        telefono: item.telefono,
      })}
      scopeParams={{ persona: scopePersonaId }}
      defaults={{ persona: { id: scopePersonaId } }}
    />
  )
}
