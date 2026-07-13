import { routesConfig } from '@/config/routes.app'
import { roles, type RoleName } from '@/enum/role'
import type { RoutesEnum } from '@/enum/routes..app'
import type User from '@/models/api/entities/User'

export function isAuthorized(role: RoleName, route: RoutesEnum): boolean {
  if (role === roles.superAdmin) return true
  const routeData = routesConfig[route]
  if (routeData)
    return routeData.roles.includes(role) || routeData.roles.includes('*')
  return false
}

export function hasPermission(
  user: User | null | undefined,
  method: string,
  path: string
): boolean {
  if (!user?.role) return false
  if (user.role.name === roles.superAdmin) return true
  return (user.role.permissions ?? []).some(
    (permission) =>
      permission.method?.toUpperCase() === method.toUpperCase() &&
      permission.path === path
  )
}

export function canManageDeleted(
  user: User | null | undefined,
  resource: string
): boolean {
  return (
    hasPermission(user, 'PATCH', `/api/${resource}/:id/soft-delete`) ||
    hasPermission(user, 'PATCH', `/api/${resource}/:id/restore`)
  )
}
