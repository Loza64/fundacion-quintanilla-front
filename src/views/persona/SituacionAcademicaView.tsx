import { ESTADO_ACADEMICO, NIVEL_ACADEMICO } from '@/enum/catalog'
import { queryKeys } from '@/lib/queryClient'
import type SituacionAcademica from '@/models/api/entities/SituacionAcademica'
import type { CrudField, CrudFilter } from '@/models/app/crud'
import { situacionAcademicaService } from '@/services/api'
import { enumOptions, humanize } from '@/utils/options'
import CrudView from '@/views/core/CrudView'
import { Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

export default function SituacionAcademicaView({
  scopePersonaId,
}: {
  scopePersonaId: number
}) {
  const nivelOptions = enumOptions(NIVEL_ACADEMICO)
  const estadoOptions = enumOptions(ESTADO_ACADEMICO)

  const columns: ColumnsType<SituacionAcademica> = [
    {
      title: 'Nivel',
      dataIndex: 'nivel_academico',
      key: 'nivel_academico',
      align: 'center',
      render: (value?: string) => (value ? humanize(value) : '—'),
    },
    {
      title: 'Institución',
      dataIndex: 'institucion',
      key: 'institucion',
      align: 'center',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      align: 'center',
      render: (value?: string) => (value ? <Tag>{humanize(value)}</Tag> : '—'),
    },
  ]

  const fields: CrudField[] = [
    {
      name: 'nivel_academico',
      label: 'Nivel académico',
      type: 'select',
      options: nivelOptions,
    },
    { name: 'institucion', label: 'Institución' },
    {
      name: 'estado',
      label: 'Estado',
      type: 'select',
      options: estadoOptions,
    },
  ]

  const filters: CrudFilter[] = [
    { name: 'nivel_academico', label: 'Nivel', options: nivelOptions },
    { name: 'estado', label: 'Estado', options: estadoOptions },
  ]

  return (
    <CrudView<SituacionAcademica>
      service={situacionAcademicaService}
      queryKey={queryKeys.situacionAcademica}
      label="situación académica"
      searchable={false}
      columns={columns}
      fields={fields}
      filters={filters}
      fetchOne={(id) => situacionAcademicaService.findById({ id })}
      toFormValues={(item) => ({
        nivel_academico: item.nivel_academico,
        institucion: item.institucion,
        estado: item.estado,
      })}
      scopeParams={{ persona: scopePersonaId }}
      defaults={{ persona: { id: scopePersonaId } }}
    />
  )
}
