import BaseEntity from '../core/_BaseEntity'

export default interface Pais extends BaseEntity {
  nombre?: string
  codigoIso2?: string
  codigoIso3?: string
  codigoTelefonico?: string
  moneda?: string
  idiomaPrincipal?: string
  zonaHoraria?: string
  activo?: boolean
}
