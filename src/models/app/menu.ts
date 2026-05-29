import type { RoleName } from '@/enum/role'
import type { RoutesEnum } from '@/enum/routes..app'

export interface SubMenuItem {
  key: RoutesEnum
  label: string
  authorized: RoleName[]
  view?: boolean
  icon?: React.ReactNode
}

export interface MenuItem {
  key: RoutesEnum
  icon: React.ReactNode
  label: string
  authorized: RoleName[]
  view: boolean
  children: SubMenuItem[]
}
