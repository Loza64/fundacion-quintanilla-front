import { ESPECIALIDAD_PROFESIONAL } from '@/enum/catalog'
import { queryKeys } from '@/lib/queryClient'
import type ValoracionProfesional from '@/models/api/entities/ValoracionProfesional'
import type { CrudField, CrudFilter } from '@/models/app/crud'
import { valoracionProfesionalService } from '@/services/api'
import { enumOptions, humanize } from '@/utils/options'
import CrudView from '@/views/core/CrudView'
import type { ColumnsType } from 'antd/es/table'

export default function ValoracionProfesionalView({
  scopeExpedienteId,
}: {
  scopeExpedienteId: number
}) {
  const especialidadOptions = enumOptions(ESPECIALIDAD_PROFESIONAL)

  const columns: ColumnsType<ValoracionProfesional> = [
    {
      title: 'Profesional',
      dataIndex: 'profesional',
      key: 'profesional',
      align: 'center',
    },
    {
      title: 'Especialidad',
      dataIndex: 'especialidad',
      key: 'especialidad',
      align: 'center',
      render: (value?: string) => (value ? humanize(value) : '—'),
    },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha', align: 'center' },
    {
      title: 'Diagnóstico',
      dataIndex: 'diagnostico',
      key: 'diagnostico',
    },
  ]

  const fields: CrudField[] = [
    { name: 'profesional', label: 'Profesional' },
    {
      name: 'especialidad',
      label: 'Especialidad',
      type: 'select',
      options: especialidadOptions,
    },
    { name: 'fecha', label: 'Fecha', type: 'date' },
    { name: 'diagnostico', label: 'Diagnóstico', type: 'textarea' },
    { name: 'valoracion', label: 'Valoración', type: 'textarea' },
    { name: 'recomendaciones', label: 'Recomendaciones', type: 'textarea' },
  ]

  const filters: CrudFilter[] = [
    {
      name: 'especialidad',
      label: 'Especialidad',
      options: especialidadOptions,
    },
  ]

  return (
    <CrudView<ValoracionProfesional>
      service={valoracionProfesionalService}
      queryKey={queryKeys.valoracionProfesional}
      label="valoración"
      dateFilter={{
        label: 'Fecha',
        fieldOptions: [
          { value: 'fecha', label: 'Fecha' },
          { value: 'createdAt', label: 'Registro' },
        ],
      }}
      searchable={false}
      columns={columns}
      fields={fields}
      filters={filters}
      fetchOne={(id) => valoracionProfesionalService.findById({ id })}
      toFormValues={(item) => ({
        profesional: item.profesional,
        especialidad: item.especialidad,
        fecha: item.fecha,
        diagnostico: item.diagnostico,
        valoracion: item.valoracion,
        recomendaciones: item.recomendaciones,
      })}
      scopeParams={{ expediente: scopeExpedienteId }}
      defaults={{ expediente: { id: scopeExpedienteId } }}
    />
  )
}
