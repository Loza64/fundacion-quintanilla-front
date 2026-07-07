import BaseEntity from '../core/_BaseEntity'
import type Habitacion from './Habitacion'
import type Residente from './Residente'

export default interface AsignacionHabitacion extends BaseEntity {
  fecha_inicio: string
  fecha_fin?: string
  activa?: boolean
  residente?: Residente
  habitacion?: Habitacion
}
