import BaseEntity from '../core/_BaseEntity'

export default interface Beneficio extends BaseEntity {
  nombre: string
  descripcion?: string
  tipo: string
}
