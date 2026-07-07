import BaseEntity from '../core/_BaseEntity'
import type Residente from './Residente'
import type Servicio from './Servicio'

export default interface ResidenteServicio extends BaseEntity {
  fecha?: string
  observaciones?: string
  residente?: Residente
  servicio?: Servicio
}
