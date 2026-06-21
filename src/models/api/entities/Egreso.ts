import BaseEntity from '../core/_BaseEntity'
import type Residente from './Residente'

export default interface Egreso extends BaseEntity {
  fecha_egreso: string
  motivo_egreso?: string
  destino?: string
  responsable_egreso?: string
  observaciones?: string
  residente?: Residente
}
