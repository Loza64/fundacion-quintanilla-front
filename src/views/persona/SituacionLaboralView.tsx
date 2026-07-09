import {
  PRESTACION_PARO,
  SITUACION_LABORAL_TIPO,
  SITUACION_PARO,
} from '@/enum/catalog'
import { queryKeys } from '@/lib/queryClient'
import type SituacionLaboral from '@/models/api/entities/SituacionLaboral'
import type { CrudField, CrudFilter } from '@/models/app/crud'
import { situacionLaboralService } from '@/services/api'
import { enumOptions, humanize } from '@/utils/options'
import CrudView from '@/views/core/CrudView'
import type { ColumnsType } from 'antd/es/table'

export default function SituacionLaboralView({
  scopePersonaId,
}: {
  scopePersonaId: number
}) {
  const tipoOptions = enumOptions(SITUACION_LABORAL_TIPO)

  const columns: ColumnsType<SituacionLaboral> = [
    {
      title: 'Situación',
      dataIndex: 'situacion_laboral',
      key: 'situacion_laboral',
      align: 'center',
      render: (value?: string) => (value ? humanize(value) : '—'),
    },
    { title: 'Empresa', dataIndex: 'empresa', key: 'empresa', align: 'center' },
    { title: 'Cargo', dataIndex: 'cargo', key: 'cargo', align: 'center' },
    {
      title: 'Antigüedad (meses)',
      dataIndex: 'antiguedad_laboral',
      key: 'antiguedad_laboral',
      align: 'center',
    },
  ]

  const fields: CrudField[] = [
    {
      name: 'situacion_laboral',
      label: 'Situación laboral',
      type: 'select',
      options: tipoOptions,
    },
    { name: 'empresa', label: 'Empresa' },
    { name: 'cargo', label: 'Cargo' },
    {
      name: 'antiguedad_laboral',
      label: 'Antigüedad laboral (meses)',
      type: 'number',
    },
    {
      name: 'situacion_paro',
      label: 'Situación de paro',
      type: 'select',
      options: enumOptions(SITUACION_PARO),
    },
    {
      name: 'prestacion_paro',
      label: 'Prestación de paro',
      type: 'select',
      options: enumOptions(PRESTACION_PARO),
    },
    {
      name: 'antiguedad_paro',
      label: 'Antigüedad de paro (meses)',
      type: 'number',
    },
    { name: 'otra_situacion', label: 'Otra situación', type: 'textarea' },
  ]

  const filters: CrudFilter[] = [
    { name: 'situacion_laboral', label: 'Situación', options: tipoOptions },
  ]

  return (
    <CrudView<SituacionLaboral>
      service={situacionLaboralService}
      queryKey={queryKeys.situacionLaboral}
      label="situación laboral"
      rangeFilters={[
        {
          label: 'Antigüedad',
          minParam: 'antiguedad_min',
          maxParam: 'antiguedad_max',
        },
      ]}
      searchable={false}
      columns={columns}
      fields={fields}
      filters={filters}
      fetchOne={(id) => situacionLaboralService.findById({ id })}
      toFormValues={(item) => ({
        situacion_laboral: item.situacion_laboral,
        empresa: item.empresa,
        cargo: item.cargo,
        antiguedad_laboral: item.antiguedad_laboral,
        situacion_paro: item.situacion_paro,
        prestacion_paro: item.prestacion_paro,
        antiguedad_paro: item.antiguedad_paro,
        otra_situacion: item.otra_situacion,
      })}
      scopeParams={{ persona: scopePersonaId }}
      defaults={{ persona: { id: scopePersonaId } }}
    />
  )
}
