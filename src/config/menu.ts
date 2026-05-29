import { Users } from 'lucide-react'
import React from 'react'
import type { LucideProps } from 'lucide-react'
import type { MenuItem, SubMenuItem } from '@/models/app/menu'
import { roles } from '@/enum/role'
import { RoutesEnum } from '@/enum/routes..app'

export const createIcon = (IconComponent: React.ComponentType<LucideProps>) =>
  React.createElement(IconComponent)

export const menu: MenuItem[] = [
  {
    key: RoutesEnum.DASHBOARD,
    icon: createIcon(Users),
    label: 'Administración',
    authorized: [roles.all],
    view: true,
    children: [], // submenus
  },
]

export function selectItemMenu(route: string): MenuItem | undefined {
  const data = menu.find((item) => route.startsWith(item.key))
  return data
}

export function selectSubItemMenu(route: string): SubMenuItem | undefined {
  const item = selectItemMenu(route)
  const data = (item?.children || []).find((item) => item.key === route)
  return data
}
