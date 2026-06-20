import type { RoleName } from '@/enum/role'
import { RoutesEnum } from '@/enum/routes..app'

type RouteConfig = {
  auth: boolean
  roles: RoleName[]
  permission: string[]
  title: string
  search: boolean
}

export const routesConfig: Record<RoutesEnum, RouteConfig> = {
  [RoutesEnum.ROOT]: {
    auth: true,
    roles: [],
    permission: ['*'],
    title: 'Inicio',
    search: false,
  },
  [RoutesEnum.LOGIN]: {
    auth: false,
    roles: [],
    permission: ['*'],
    title: 'Login',
    search: false,
  },
  [RoutesEnum.DASHBOARD]: {
    auth: true,
    roles: ['*'],
    permission: ['*'],
    title: 'Usuarios',
    search: false,
  },
  [RoutesEnum.ROLES]: {
    auth: true,
    roles: ['ADMIN'],
    permission: ['*'],
    title: 'Roles',
    search: false,
  },
  [RoutesEnum.PERMISSIONS]: {
    auth: true,
    roles: ['ADMIN'],
    permission: ['*'],
    title: 'Permisos',
    search: false,
  },
  [RoutesEnum.PROFILE]: {
    auth: true,
    roles: ['*'],
    permission: ['*'],
    title: 'Mi perfil',
    search: false,
  },
} as const
