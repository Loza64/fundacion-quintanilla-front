import BaseEntity from '../core/_BaseEntity'
import type Beneficio from './Beneficio'
import type Persona from './Persona'

export default interface PersonaBeneficio extends BaseEntity {
  fecha?: string
  observaciones?: string
  persona?: Persona
  beneficio?: Beneficio
}
