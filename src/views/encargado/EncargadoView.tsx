import { useFindAll } from '@/hooks/core/useFindAll'
import { useSession } from '@/hooks/useSession'
import { queryKeys } from '@/lib/queryClient'
import type Albergue from '@/models/api/entities/Albergue'
import type { CrudSummaryItem } from '@/models/app/crud'
import { albergueService } from '@/services/api'
import { humanize } from '@/utils/options'
import ResidenteView from '@/views/residente/ResidenteView'
import { Card, Empty, Spin } from 'antd'

export default function EncargadoView() {
  const { profile } = useSession()

  const { data, isLoading } = useFindAll<Albergue>({
    queryKey: [...queryKeys.albergues, 'mio', String(profile?.id)],
    service: albergueService,
    queryParams: { page: 1, size: 1, encargado: profile?.id },
    enabled: !!profile?.id,
  })

  const albergue = data?.data?.[0]

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spin />
      </div>
    )
  }

  if (!albergue) {
    return (
      <div className="px-4 md:px-6">
        <Empty description="Aún no tienes un albergue asignado. Contacta al administrador." />
      </div>
    )
  }

  const summary: CrudSummaryItem[] = [
    { label: 'Nombre', value: albergue.nombre },
    { label: 'Tipo', value: humanize(albergue.tipo) },
    { label: 'Dirección', value: albergue.direccion },
    { label: 'Capacidad máxima', value: albergue.capacidad_maxima },
    { label: 'Teléfono', value: albergue.telefono || '—' },
    { label: 'Correo', value: albergue.correo || '—' },
  ]

  return (
    <div className="flex flex-col gap-4 px-4 md:px-6">
      <Card title="Mi albergue">
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {summary.map((item, index) => (
            <div key={index} className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                {item.label}
              </span>
              <span className="text-sm text-gray-800">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Residentes de mi albergue"
        styles={{ body: { padding: 12 } }}
      >
        <ResidenteView scopeAlbergueId={albergue.id} />
      </Card>
    </div>
  )
}
