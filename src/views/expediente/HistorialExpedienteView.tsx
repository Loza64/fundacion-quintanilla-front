import { ESTADO_EXPEDIENTE, TIPO_EVENTO_EXPEDIENTE } from '@/enum/catalog'
import { queryKeys } from '@/lib/queryClient'
import type HistorialExpediente from '@/models/api/entities/HistorialExpediente'
import type { CrudField, CrudFilter } from '@/models/app/crud'
import { historialExpedienteService } from '@/services/api'
import { enumOptions, humanize } from '@/utils/options'
import CrudView from '@/views/core/CrudView'
import { Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

export default function HistorialExpedienteView({
  scopeExpedienteId,
}: {
  scopeExpedienteId: number
}) {
  const tipoEventoOptions = enumOptions(TIPO_EVENTO_EXPEDIENTE)
  const estadoOptions = enumOptions(ESTADO_EXPEDIENTE)

  const columns: ColumnsType<HistorialExpediente> = [
    {
      title: 'Evento',
      dataIndex: 'tipo_evento',
      key: 'tipo_evento',
      align: 'center',
      render: (value: string) => <Tag color="blue">{humanize(value)}</Tag>,
    },
    { title: 'Título', dataIndex: 'titulo', key: 'titulo', align: 'center' },
    {
      title: 'Registrado por',
      dataIndex: 'registrado_por',
      key: 'registrado_por',
      align: 'center',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
  ]

  const fields: CrudField[] = [
    {
      name: 'tipo_evento',
      label: 'Tipo de evento',
      type: 'select',
      required: true,
      options: tipoEventoOptions,
    },
    { name: 'titulo', label: 'Título', required: true },
    { name: 'descripcion', label: 'Descripción', type: 'textarea' },
    {
      name: 'estado_anterior',
      label: 'Estado anterior',
      type: 'select',
      options: estadoOptions,
    },
    {
      name: 'estado_nuevo',
      label: 'Estado nuevo',
      type: 'select',
      options: estadoOptions,
    },
    { name: 'registrado_por', label: 'Registrado por' },
    { name: 'observaciones', label: 'Observaciones', type: 'textarea' },
  ]

  const filters: CrudFilter[] = [
    { name: 'tipo_evento', label: 'Evento', options: tipoEventoOptions },
  ]

  return (
    <CrudView<HistorialExpediente>
      service={historialExpedienteService}
      queryKey={queryKeys.historialExpediente}
      label="evento del historial"
      searchable={false}
      columns={columns}
      fields={fields}
      filters={filters}
      fetchOne={(id) => historialExpedienteService.findById({ id })}
      toFormValues={(item) => ({
        tipo_evento: item.tipo_evento,
        titulo: item.titulo,
        descripcion: item.descripcion,
        estado_anterior: item.estado_anterior,
        estado_nuevo: item.estado_nuevo,
        registrado_por: item.registrado_por,
        observaciones: item.observaciones,
      })}
      scopeParams={{ expediente: scopeExpedienteId }}
      defaults={{ expediente: { id: scopeExpedienteId } }}
    />
  )
}
