import BaseEntity from '../core/_BaseEntity'
import type Persona from './Persona'

export default interface Expediente extends BaseEntity {
  estado: string
  nivel_riesgo?: string | null
  referencia_ingreso?: string
  observaciones_generales?: string
  persona?: Persona | null
}
