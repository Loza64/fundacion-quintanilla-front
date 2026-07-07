import BaseEntity from '../core/_BaseEntity'
import type Persona from './Persona'

export default interface SituacionLaboral extends BaseEntity {
  situacion_laboral?: string
  empresa?: string | null
  cargo?: string | null
  antiguedad_laboral?: number | null
  situacion_paro?: string
  prestacion_paro?: string
  antiguedad_paro?: number | null
  otra_situacion?: string | null
  persona?: Persona
}
