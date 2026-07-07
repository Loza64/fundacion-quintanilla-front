import BaseEntity from '../core/_BaseEntity'

export default interface Permissions extends BaseEntity {
  path: string
  method: string
  title?: string
}
