import BaseEntity from '../core/_BaseEntity'
import type Albergue from './Albergue'
import type Residente from './Residente'

export default interface Recibo extends BaseEntity {
  tipo_recibo: string
  monto: number | string
  fecha_emision: string
  fecha_pago?: string
  numero_recibo?: string
  observaciones?: string
  albergue?: Albergue
  residente?: Residente | null
}
