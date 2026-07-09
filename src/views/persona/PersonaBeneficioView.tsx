import { useFindAll } from '@/hooks/core/useFindAll'
import { queryKeys } from '@/lib/queryClient'
import type Beneficio from '@/models/api/entities/Beneficio'
import type PersonaBeneficio from '@/models/api/entities/PersonaBeneficio'
import type { CrudField } from '@/models/app/crud'
import { beneficioService, personaBeneficioService } from '@/services/api'
import CrudView from '@/views/core/CrudView'
import type { ColumnsType } from 'antd/es/table'

export default function PersonaBeneficioView({
  scopePersonaId,
}: {
  scopePersonaId: number
}) {
  const { data: beneficiosData } = useFindAll<Beneficio>({
    queryKey: queryKeys.beneficios,
    service: beneficioService,
    queryParams: { page: 1, size: 200 },
  })

  const beneficioOptions = (beneficiosData?.data ?? []).map((beneficio) => ({
    label: beneficio.nombre,
    value: beneficio.id ?? 0,
  }))

  const columns: ColumnsType<PersonaBeneficio> = [
    {
      title: 'Beneficio',
      dataIndex: ['beneficio', 'nombre'],
      key: 'beneficio',
      align: 'center',
    },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha', align: 'center' },
    {
      title: 'Observaciones',
      dataIndex: 'observaciones',
      key: 'observaciones',
    },
  ]

  const fields: CrudField[] = [
    {
      name: 'beneficio',
      label: 'Beneficio',
      type: 'select',
      required: true,
      options: beneficioOptions,
    },
    { name: 'fecha', label: 'Fecha', type: 'date' },
    { name: 'observaciones', label: 'Observaciones', type: 'textarea' },
  ]

  return (
    <CrudView<PersonaBeneficio>
      service={personaBeneficioService}
      queryKey={queryKeys.personaBeneficio}
      label="beneficio asignado"
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
      fetchOne={(id) => personaBeneficioService.findById({ id })}
      toFormValues={(item) => ({
        beneficio: item.beneficio?.id,
        fecha: item.fecha,
        observaciones: item.observaciones,
      })}
      toPayload={(values) => {
        const { beneficio, ...rest } = values
        const payload: Record<string, unknown> = { ...rest }
        if (beneficio != null) payload.beneficio = { id: beneficio }
        return payload as Partial<PersonaBeneficio>
      }}
      scopeParams={{ persona: scopePersonaId }}
      defaults={{ persona: { id: scopePersonaId } }}
    />
  )
}
