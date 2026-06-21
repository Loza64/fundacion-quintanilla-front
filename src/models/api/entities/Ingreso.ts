import BaseEntity from '../core/_BaseEntity'
import type Residente from './Residente'

export default interface Ingreso extends BaseEntity {
  fecha_ingreso: string
  motivo?: string
  referido_por?: string
  responsable_ingreso?: string
  observaciones?: string
  residente?: Residente
}
