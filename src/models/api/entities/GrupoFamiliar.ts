import BaseEntity from '../core/_BaseEntity'
import type Persona from './Persona'

export default interface GrupoFamiliar extends BaseEntity {
  nombres: string
  apellidos: string
  dui?: string
  parentesco?: string
  fecha_nacimiento?: string
  sexo?: string
  estado_civil?: string
  telefono?: string
  persona?: Persona
}
