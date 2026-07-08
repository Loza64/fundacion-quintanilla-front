import BaseEntity from '../core/_BaseEntity'
import type Pais from './Pais'

export default interface DivisionGeografica extends BaseEntity {
  nombre?: string
  tipo?: string
  nivel?: number
  codigo?: string
  postal?: string
  pais?: Pais | null
  padre?: DivisionGeografica | null
}
