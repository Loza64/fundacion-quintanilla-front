import { queryKeys } from '@/lib/queryClient'
import type Pais from '@/models/api/entities/Pais'
import type { CrudField, CrudSummaryItem } from '@/models/app/crud'
import { paisService } from '@/services/api'
import CrudView from '@/views/core/CrudView'
import { Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

export default function PaisView() {
  const columns: ColumnsType<Pais> = [
    { title: 'ID', dataIndex: 'id', key: 'id', align: 'center' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre', align: 'center' },
    {
      title: 'ISO2',
      dataIndex: 'codigoIso2',
      key: 'codigoIso2',
      align: 'center',
    },
    {
      title: 'ISO3',
      dataIndex: 'codigoIso3',
      key: 'codigoIso3',
      align: 'center',
    },
    {
      title: 'Teléfono',
      dataIndex: 'codigoTelefonico',
      key: 'codigoTelefonico',
      align: 'center',
      render: (value?: string) => value || '—',
    },
    {
      title: 'Activo',
      dataIndex: 'activo',
      key: 'activo',
      align: 'center',
      render: (activo?: boolean) =>
        activo === false ? (
          <Tag color="red">No</Tag>
        ) : (
          <Tag color="green">Sí</Tag>
        ),
    },
  ]

  const fields: CrudField[] = [
    { name: 'nombre', label: 'Nombre', required: true },
    {
      name: 'codigoIso2',
      label: 'Código ISO2',
      required: true,
      placeholder: 'SV',
    },
    {
      name: 'codigoIso3',
      label: 'Código ISO3',
      required: true,
      placeholder: 'SLV',
    },
    {
      name: 'codigoTelefonico',
      label: 'Código telefónico',
      placeholder: '+503',
    },
    { name: 'moneda', label: 'Moneda', placeholder: 'USD' },
    { name: 'idiomaPrincipal', label: 'Idioma principal' },
    { name: 'zonaHoraria', label: 'Zona horaria' },
    { name: 'activo', label: 'Activo', type: 'switch' },
  ]

  const toFormValues = (pais: Pais) => ({
    nombre: pais.nombre,
    codigoIso2: pais.codigoIso2,
    codigoIso3: pais.codigoIso3,
    codigoTelefonico: pais.codigoTelefonico,
    moneda: pais.moneda,
    idiomaPrincipal: pais.idiomaPrincipal,
    zonaHoraria: pais.zonaHoraria,
    activo: pais.activo ?? true,
  })

  const summary = (pais: Pais): CrudSummaryItem[] => [
    { label: 'Nombre', value: pais.nombre },
    { label: 'ISO2', value: pais.codigoIso2 || '—' },
    { label: 'ISO3', value: pais.codigoIso3 || '—' },
    { label: 'Teléfono', value: pais.codigoTelefonico || '—' },
    { label: 'Moneda', value: pais.moneda || '—' },
    { label: 'Idioma', value: pais.idiomaPrincipal || '—' },
    { label: 'Zona horaria', value: pais.zonaHoraria || '—' },
  ]

  return (
    <CrudView<Pais>
      service={paisService}
      queryKey={queryKeys.paises}
      label="país"
      testId="pais"
      exportable
      columns={columns}
      fields={fields}
      toFormValues={toFormValues}
      fetchOne={(id) => paisService.findById({ id })}
      summary={summary}
    />
  )
}
