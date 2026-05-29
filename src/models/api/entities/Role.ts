import type { RoleName } from '@/enum/role'
import type Permissions from './Permissions'
import BaseEntity from '../core/_BaseEntity'

export default interface Role extends BaseEntity {
  name: RoleName
  permissions?: Permissions[]
}
