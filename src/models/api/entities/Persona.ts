import BaseEntity from '../core/_BaseEntity'
import type Upload from './Upload'

export default interface Persona extends BaseEntity {
  nombres: string
  apellidos: string
  profile?: Upload | null
  fecha_nacimiento?: string
  edad?: number
  sexo?: string
  estado_civil?: string
  nacionalidad?: string
  documento_identificacion?: string
  direccion?: string
  telefono?: string
  correo_electronico?: string
  discapacidad?: string
  religion?: string
  idioma?: string
  observaciones?: string
}
