import { useFindAll } from '@/hooks/core/useFindAll'
import { TIPO_RECIBO } from '@/enum/catalog'
import { queryKeys } from '@/lib/queryClient'
import type Albergue from '@/models/api/entities/Albergue'
import type Recibo from '@/models/api/entities/Recibo'
import type Residente from '@/models/api/entities/Residente'
import type { CrudField, CrudFilter } from '@/models/app/crud'
import {
  albergueService,
  reciboService,
  residenteService,
} from '@/services/api'
import { enumOptions, humanize } from '@/utils/options'
import CrudView from '@/views/core/CrudView'
import { Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

export default function ReciboView({
  scopeAlbergueId,
  scopeResidenteId,
}: {
  scopeAlbergueId?: number
  scopeResidenteId?: number
}) {
  const scopedAlbergue = scopeAlbergueId != null
  const scopedResidente = scopeResidenteId != null

  const { data: alberguesData } = useFindAll<Albergue>({
    queryKey: queryKeys.albergues,
    service: albergueService,
    queryParams: { page: 1, size: 200 },
  })
  const { data: residentesData } = useFindAll<Residente>({
    queryKey: queryKeys.residentes,
    service: residenteService,
    queryParams: { page: 1, size: 200 },
  })

  const albergueOptions = (alberguesData?.data ?? []).map((albergue) => ({
    label: albergue.nombre,
    value: albergue.id ?? 0,
  }))
  const residenteOptions = (residentesData?.data ?? []).map((residente) => ({
    label: `Residente #${residente.id}${residente.albergue ? ` · ${residente.albergue.nombre}` : ''}`,
    value: residente.id ?? 0,
  }))

  const tipoOptions = enumOptions(TIPO_RECIBO)

  const columns: ColumnsType<Recibo> = [
    { title: 'ID', dataIndex: 'id', key: 'id', align: 'center' },
    ...(scopedAlbergue
      ? []
      : [
          {
            title: 'Albergue',
            dataIndex: ['albergue', 'nombre'],
            key: 'albergue',
            align: 'center' as const,
          },
        ]),
    {
      title: 'Tipo',
      dataIndex: 'tipo_recibo',
      key: 'tipo_recibo',
      align: 'center',
      render: (value: string) => <Tag color="geekblue">{humanize(value)}</Tag>,
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      align: 'center',
      render: (monto: number | string) => `$${Number(monto).toFixed(2)}`,
    },
    {
      title: 'Emisión',
      dataIndex: 'fecha_emision',
      key: 'fecha_emision',
      align: 'center',
      render: (value?: string) => (value ? value.split('T')[0] : '—'),
    },
    {
      title: 'N° recibo',
      dataIndex: 'numero_recibo',
      key: 'numero_recibo',
      align: 'center',
    },
  ]

  const fields: CrudField[] = [
    ...(scopedAlbergue
      ? []
      : [
          {
            name: 'albergue',
            label: 'Albergue',
            type: 'select' as const,
            required: true,
            options: albergueOptions,
          },
        ]),
    ...(scopedResidente
      ? []
      : [
          {
            name: 'residente',
            label: 'Residente (opcional)',
            type: 'select' as const,
            options: residenteOptions,
          },
        ]),
    {
      name: 'tipo_recibo',
      label: 'Tipo de recibo',
      type: 'select',
      required: true,
      options: tipoOptions,
    },
    { name: 'monto', label: 'Monto', type: 'number', required: true },
    {
      name: 'fecha_emision',
      label: 'Fecha de emisión',
      type: 'date',
      required: true,
    },
    { name: 'fecha_pago', label: 'Fecha de pago', type: 'date' },
    { name: 'numero_recibo', label: 'Número de recibo' },
    { name: 'observaciones', label: 'Observaciones', type: 'textarea' },
  ]

  const filters: CrudFilter[] = [
    ...(scopedAlbergue
      ? []
      : [{ name: 'albergue', label: 'Albergue', options: albergueOptions }]),
    { name: 'tipo_recibo', label: 'Tipo', options: tipoOptions },
  ]

  return (
    <CrudView<Recibo>
      service={reciboService}
      queryKey={queryKeys.recibos}
      label="recibo"
      dateFilter={{
        label: 'Fecha',
        fieldOptions: [
          { value: 'fecha_emision', label: 'Emisión' },
          { value: 'fecha_pago', label: 'Pago' },
          { value: 'createdAt', label: 'Registro' },
        ],
      }}
      exportable={!scopedAlbergue && !scopedResidente}
      searchable={false}
      columns={columns}
      fields={fields}
      filters={filters}
      fetchOne={(id) => reciboService.findById({ id })}
      toFormValues={(recibo) => ({
        ...(scopedAlbergue ? {} : { albergue: recibo.albergue?.id }),
        ...(scopedResidente ? {} : { residente: recibo.residente?.id }),
        tipo_recibo: recibo.tipo_recibo,
        monto: recibo.monto != null ? Number(recibo.monto) : undefined,
        fecha_emision: recibo.fecha_emision,
        fecha_pago: recibo.fecha_pago,
        numero_recibo: recibo.numero_recibo,
        observaciones: recibo.observaciones,
      })}
      toPayload={(values) => {
        const { albergue, residente, ...rest } = values
        const payload: Record<string, unknown> = { ...rest }
        if (!scopedAlbergue && albergue != null)
          payload.albergue = { id: albergue }
        if (!scopedResidente && residente != null)
          payload.residente = { id: residente }
        return payload as Partial<Recibo>
      }}
      scopeParams={{
        ...(scopedAlbergue ? { albergue: scopeAlbergueId } : {}),
        ...(scopedResidente ? { residente: scopeResidenteId } : {}),
      }}
      defaults={{
        ...(scopedAlbergue ? { albergue: { id: scopeAlbergueId } } : {}),
        ...(scopedResidente ? { residente: { id: scopeResidenteId } } : {}),
      }}
    />
  )
}
