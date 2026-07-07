import type { CrudSummaryItem, RelationTab } from '@/models/app/crud'
import { Drawer, Tabs } from 'antd'

export interface CrudDetailDrawerProps<Entity> {
  open: boolean
  title: string
  record: Entity | null
  relations: RelationTab<Entity>[]
  summary?: (entity: Entity) => CrudSummaryItem[]
  onClose: () => void
}

export default function CrudDetailDrawer<Entity>({
  open,
  title,
  record,
  relations,
  summary,
  onClose,
}: CrudDetailDrawerProps<Entity>) {
  return (
    <Drawer
      open={open}
      title={title}
      onClose={onClose}
      width="min(960px, 92vw)"
      destroyOnHidden
    >
      {record && summary && (
        <div className="mb-6 grid grid-cols-1 gap-x-6 gap-y-4 rounded-lg border border-gray-100 bg-gray-50 p-4 sm:grid-cols-2">
          {summary(record).map((item, index) => (
            <div key={index} className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                {item.label}
              </span>
              <span className="text-sm text-gray-800">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {record && relations.length > 0 && (
        <Tabs
          items={relations.map((relation) => ({
            key: relation.key,
            label: relation.label,
            children: relation.render(record),
          }))}
        />
      )}
    </Drawer>
  )
}
