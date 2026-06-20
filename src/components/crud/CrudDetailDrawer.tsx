import type { CrudSummaryItem, RelationTab } from '@/models/app/crud'
import { Descriptions, Drawer, Tabs } from 'antd'

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
        <Descriptions
          bordered
          size="small"
          column={2}
          className="mb-6"
          items={summary(record).map((item, index) => ({
            key: index,
            label: item.label,
            children: item.value,
          }))}
        />
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
