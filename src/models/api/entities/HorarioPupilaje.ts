import BaseEntity from '../core/_BaseEntity'
import type Residente from './Residente'

export default interface HorarioPupilaje extends BaseEntity {
  dia: string
  entrada: string
  salida: string
  observaciones?: string
  residente?: Residente
}
