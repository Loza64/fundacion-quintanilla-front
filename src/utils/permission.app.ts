import { routesConfig } from '@/config/routes.app'
import type { RoleName } from '@/enum/role'
import type { RoutesEnum } from '@/enum/routes..app'

export function isAuthorized(role: RoleName, route: RoutesEnum): boolean {
  const routeData = routesConfig[route]
  if (routeData)
    return routeData.roles.includes(role) || routeData.roles.includes('*')
  return false
}
