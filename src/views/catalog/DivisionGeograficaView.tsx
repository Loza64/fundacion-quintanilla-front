import { TIPO_DIVISION_GEOGRAFICA } from '@/enum/catalog'
import { useFindAll } from '@/hooks/core/useFindAll'
import { queryKeys } from '@/lib/queryClient'
import type DivisionGeografica from '@/models/api/entities/DivisionGeografica'
import type Pais from '@/models/api/entities/Pais'
import type { CrudField, CrudFilter, CrudSummaryItem } from '@/models/app/crud'
import { divisionGeograficaService, paisService } from '@/services/api'
import { enumOptions, humanize } from '@/utils/options'
import CrudView from '@/views/core/CrudView'
import { Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

export default function DivisionGeograficaView() {
  const tipoOptions = enumOptions(TIPO_DIVISION_GEOGRAFICA)

  const { data: paisesData } = useFindAll<Pais>({
    queryKey: queryKeys.paises,
    service: paisService,
    queryParams: { page: 1, size: 100 },
  })

  const { data: divisionesData } = useFindAll<DivisionGeografica>({
    queryKey: queryKeys.divisionesGeograficas,
    service: divisionGeograficaService,
    queryParams: { page: 1, size: 100 },
  })

  const paisOptions = (paisesData?.data ?? []).map((pais) => ({
    label: pais.nombre ?? '',
    value: pais.id ?? 0,
  }))

  const padreOptions = (divisionesData?.data ?? []).map((division) => ({
    label: division.pais?.nombre
      ? `${division.nombre} (${division.pais.nombre})`
      : (division.nombre ?? ''),
    value: division.id ?? 0,
  }))

  const columns: ColumnsType<DivisionGeografica> = [
    { title: 'ID', dataIndex: 'id', key: 'id', align: 'center' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre', align: 'center' },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      align: 'center',
      render: (tipo?: string) =>
        tipo ? <Tag color="geekblue">{humanize(tipo)}</Tag> : '—',
    },
    { title: 'Nivel', dataIndex: 'nivel', key: 'nivel', align: 'center' },
    {
      title: 'País',
      key: 'pais',
      align: 'center',
      render: (_, division) => division.pais?.nombre ?? '—',
    },
  ]

  const fields: CrudField[] = [
    { name: 'nombre', label: 'Nombre', required: true },
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'select',
      required: true,
      options: tipoOptions,
    },
    {
      name: 'pais',
      label: 'País',
      type: 'select',
      options: paisOptions,
      placeholder: 'Sin país',
    },
    {
      name: 'padre',
      label: 'División padre',
      type: 'select',
      options: padreOptions,
      placeholder: 'Sin división padre',
    },
    { name: 'codigo', label: 'Código' },
    { name: 'postal', label: 'Código postal' },
  ]

  const filters: CrudFilter[] = [
    { name: 'tipo', label: 'Tipo', options: tipoOptions },
    { name: 'paisId', label: 'País', options: paisOptions },
  ]

  const toFormValues = (division: DivisionGeografica) => ({
    nombre: division.nombre,
    tipo: division.tipo,
    pais: division.pais?.id,
    padre: division.padre?.id,
    codigo: division.codigo,
    postal: division.postal,
  })

  const toPayload = (values: Record<string, unknown>) => {
    const { pais, padre, ...rest } = values
    const payload: Record<string, unknown> = { ...rest }
    if (pais != null) payload.pais = { id: pais }
    if (padre != null) payload.padre = { id: padre }
    return payload as Partial<DivisionGeografica>
  }

  const summary = (division: DivisionGeografica): CrudSummaryItem[] => [
    { label: 'Nombre', value: division.nombre },
    { label: 'Tipo', value: division.tipo ? humanize(division.tipo) : '—' },
    { label: 'Nivel', value: division.nivel ?? '—' },
    { label: 'País', value: division.pais?.nombre ?? '—' },
    { label: 'División padre', value: division.padre?.nombre ?? '—' },
    { label: 'Código', value: division.codigo || '—' },
    { label: 'Código postal', value: division.postal || '—' },
  ]

  return (
    <CrudView<DivisionGeografica>
      service={divisionGeograficaService}
      queryKey={queryKeys.divisionesGeograficas}
      label="división geográfica"
      testId="division-geografica"
      exportable
      columns={columns}
      fields={fields}
      filters={filters}
      toFormValues={toFormValues}
      toPayload={toPayload}
      fetchOne={(id) => divisionGeograficaService.findById({ id })}
      summary={summary}
    />
  )
}
