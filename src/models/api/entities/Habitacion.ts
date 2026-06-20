import BaseEntity from '../core/_BaseEntity'
import type Albergue from './Albergue'

export default interface Habitacion extends BaseEntity {
  nombre: string
  capacidad: number
  tipo: string
  estado: string
  albergue?: Albergue
}
