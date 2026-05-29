import Role from '@/models/api/entities/Role'
import Service from '../core/Service'
import UserService from './custom/UserService'

//custom
export const userService = new UserService()

//core
export const roleService = new Service<Role>({ endpoint: 'roles' })
