import BaseEntity from '../core/_BaseEntity'
import type Persona from './Persona'

export default interface Economia extends BaseEntity {
  item: string
  descripcion?: string
  cantidad?: number | string
  tipo?: string
  persona?: Persona
}
