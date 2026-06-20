import BaseEntity from '../core/_BaseEntity'

export default interface Servicio extends BaseEntity {
  nombre: string
  descripcion?: string
  precio?: number | string | null
  tipo?: string
}
