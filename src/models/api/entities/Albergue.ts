import BaseEntity from '../core/_BaseEntity'
import type User from './User'

export default interface Albergue extends BaseEntity {
  nombre: string
  direccion: string
  tipo: string
  capacidad_maxima: number
  telefono?: string
  correo?: string
  encargado?: User | null
}
