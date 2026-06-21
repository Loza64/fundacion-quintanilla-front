import {
  BarChart3,
  BedDouble,
  Building2,
  CircleUser,
  Contact,
  FolderOpen,
  Gift,
  HousePlus,
  KeyRound,
  Receipt,
  Shield,
  Users,
  Wrench,
} from 'lucide-react'
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
    label: 'Usuarios',
    authorized: [roles.admin],
    view: true,
    children: [],
  },
  {
    key: RoutesEnum.ROLES,
    icon: createIcon(Shield),
    label: 'Roles',
    authorized: [roles.admin],
    view: true,
    children: [],
  },
  {
    key: RoutesEnum.PERMISSIONS,
    icon: createIcon(KeyRound),
    label: 'Permisos',
    authorized: [roles.admin],
    view: true,
    children: [],
  },
  {
    key: RoutesEnum.ALBERGUES,
    icon: createIcon(Building2),
    label: 'Albergues',
    authorized: [roles.admin],
    view: true,
    children: [],
  },
  {
    key: RoutesEnum.HABITACIONES,
    icon: createIcon(BedDouble),
    label: 'Habitaciones',
    authorized: [roles.admin],
    view: true,
    children: [],
  },
  {
    key: RoutesEnum.BENEFICIOS,
    icon: createIcon(Gift),
    label: 'Beneficios',
    authorized: [roles.admin],
    view: true,
    children: [],
  },
  {
    key: RoutesEnum.SERVICIOS,
    icon: createIcon(Wrench),
    label: 'Servicios',
    authorized: [roles.admin],
    view: true,
    children: [],
  },
  {
    key: RoutesEnum.PERSONAS,
    icon: createIcon(Contact),
    label: 'Personas',
    authorized: [roles.admin],
    view: true,
    children: [],
  },
  {
    key: RoutesEnum.EXPEDIENTES,
    icon: createIcon(FolderOpen),
    label: 'Expedientes',
    authorized: [roles.admin],
    view: true,
    children: [],
  },
  {
    key: RoutesEnum.RESIDENTES,
    icon: createIcon(HousePlus),
    label: 'Residentes',
    authorized: [roles.admin],
    view: true,
    children: [],
  },
  {
    key: RoutesEnum.RECIBOS,
    icon: createIcon(Receipt),
    label: 'Recibos',
    authorized: [roles.admin],
    view: true,
    children: [],
  },
  {
    key: RoutesEnum.REPORTES,
    icon: createIcon(BarChart3),
    label: 'Reportes',
    authorized: [roles.admin],
    view: true,
    children: [],
  },
  {
    key: RoutesEnum.PROFILE,
    icon: createIcon(CircleUser),
    label: 'Mi perfil',
    authorized: [roles.all],
    view: true,
    children: [],
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
