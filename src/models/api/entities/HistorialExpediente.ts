import BaseEntity from '../core/_BaseEntity'
import type Expediente from './Expediente'

export default interface HistorialExpediente extends BaseEntity {
  tipo_evento: string
  titulo: string
  descripcion?: string
  estado_anterior?: string
  estado_nuevo?: string
  registrado_por?: string
  observaciones?: string
  fecha_registro?: string
  expediente?: Expediente
}
