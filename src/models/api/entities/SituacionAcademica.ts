import BaseEntity from '../core/_BaseEntity'
import type Persona from './Persona'

export default interface SituacionAcademica extends BaseEntity {
  nivel_academico?: string
  institucion?: string
  estado?: string
  persona?: Persona
}
