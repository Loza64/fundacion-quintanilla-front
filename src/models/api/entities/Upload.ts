import BaseEntity from '../core/_BaseEntity'

export default interface Upload extends BaseEntity {
  url: string
  secureUrl: string
  publicId: string
  format?: string
  originalFilename?: string
}
