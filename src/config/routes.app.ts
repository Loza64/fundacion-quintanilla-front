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
    roles: ['*'],
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
    roles: ['ADMIN'],
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
  [RoutesEnum.PAISES]: {
    auth: true,
    roles: ['ADMIN'],
    permission: ['*'],
    title: 'Países',
    search: false,
  },
  [RoutesEnum.DIVISIONES_GEOGRAFICAS]: {
    auth: true,
    roles: ['ADMIN'],
    permission: ['*'],
    title: 'Divisiones geográficas',
    search: false,
  },
  [RoutesEnum.ALBERGUES]: {
    auth: true,
    roles: ['ADMIN'],
    permission: ['*'],
    title: 'Albergues',
    search: false,
  },
  [RoutesEnum.HABITACIONES]: {
    auth: true,
    roles: ['ADMIN'],
    permission: ['*'],
    title: 'Habitaciones',
    search: false,
  },
  [RoutesEnum.BENEFICIOS]: {
    auth: true,
    roles: ['ADMIN'],
    permission: ['*'],
    title: 'Beneficios',
    search: false,
  },
  [RoutesEnum.SERVICIOS]: {
    auth: true,
    roles: ['ADMIN'],
    permission: ['*'],
    title: 'Servicios',
    search: false,
  },
  [RoutesEnum.PERSONAS]: {
    auth: true,
    roles: ['ADMIN'],
    permission: ['*'],
    title: 'Personas',
    search: false,
  },
  [RoutesEnum.EXPEDIENTES]: {
    auth: true,
    roles: ['ADMIN'],
    permission: ['*'],
    title: 'Expedientes',
    search: false,
  },
  [RoutesEnum.RESIDENTES]: {
    auth: true,
    roles: ['ADMIN'],
    permission: ['*'],
    title: 'Residentes',
    search: false,
  },
  [RoutesEnum.RECIBOS]: {
    auth: true,
    roles: ['ADMIN'],
    permission: ['*'],
    title: 'Recibos',
    search: false,
  },
  [RoutesEnum.REPORTES]: {
    auth: true,
    roles: ['ADMIN'],
    permission: ['*'],
    title: 'Reportes',
    search: false,
  },
  [RoutesEnum.ENCARGADO]: {
    auth: true,
    roles: ['ENCARGADO', 'ADMIN'],
    permission: ['*'],
    title: 'Mi albergue',
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
