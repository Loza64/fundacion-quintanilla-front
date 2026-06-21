import BaseEntity from '../core/_BaseEntity'
import type Albergue from './Albergue'
import type Expediente from './Expediente'

export default interface Residente extends BaseEntity {
  activo?: boolean
  tipo_residente: string
  motivo_ingreso?: string
  fecha_ingreso: string
  expediente?: Expediente
  albergue?: Albergue
}
