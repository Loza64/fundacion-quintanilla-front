import Role from '@/models/api/entities/Role'
import Permissions from '@/models/api/entities/Permissions'
import Albergue from '@/models/api/entities/Albergue'
import Habitacion from '@/models/api/entities/Habitacion'
import Beneficio from '@/models/api/entities/Beneficio'
import Servicio from '@/models/api/entities/Servicio'
import Service from '../core/Service'
import UserService from './custom/UserService'

//custom
export const userService = new UserService()

//core
export const roleService = new Service<Role>({ endpoint: 'roles' })
export const permissionService = new Service<Permissions>({
  endpoint: 'permissions',
})
export const albergueService = new Service<Albergue>({ endpoint: 'albergues' })
export const habitacionService = new Service<Habitacion>({
  endpoint: 'habitaciones',
})
export const beneficioService = new Service<Beneficio>({
  endpoint: 'beneficios',
})
export const servicioService = new Service<Servicio>({ endpoint: 'servicios' })
