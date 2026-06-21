import BaseEntity from '../core/_BaseEntity'
import type Expediente from './Expediente'

export default interface ValoracionProfesional extends BaseEntity {
  profesional?: string
  especialidad?: string
  fecha?: string
  diagnostico?: string
  valoracion?: string
  recomendaciones?: string
  expediente?: Expediente
}
