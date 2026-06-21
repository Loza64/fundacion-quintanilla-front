import Role from '@/models/api/entities/Role'
import Permissions from '@/models/api/entities/Permissions'
import Albergue from '@/models/api/entities/Albergue'
import Habitacion from '@/models/api/entities/Habitacion'
import Beneficio from '@/models/api/entities/Beneficio'
import Servicio from '@/models/api/entities/Servicio'
import Persona from '@/models/api/entities/Persona'
import GrupoFamiliar from '@/models/api/entities/GrupoFamiliar'
import SituacionLaboral from '@/models/api/entities/SituacionLaboral'
import SituacionAcademica from '@/models/api/entities/SituacionAcademica'
import Economia from '@/models/api/entities/Economia'
import PersonaBeneficio from '@/models/api/entities/PersonaBeneficio'
import Expediente from '@/models/api/entities/Expediente'
import HistorialExpediente from '@/models/api/entities/HistorialExpediente'
import ValoracionProfesional from '@/models/api/entities/ValoracionProfesional'
import Service from '../core/Service'
import UserService from './custom/UserService'

//custom
export const userService = new UserService()

//core
export const roleService = new Service<Role>({ endpoint: 'roles' })
export const permissionService = new Service<Permissions>({
  endpoint: 'permissions',
})
export const albergueService = new Service<Albergue>({ endpoint: 'albergues' })
export const habitacionService = new Service<Habitacion>({
  endpoint: 'habitaciones',
})
export const beneficioService = new Service<Beneficio>({
  endpoint: 'beneficios',
})
export const servicioService = new Service<Servicio>({ endpoint: 'servicios' })
export const personaService = new Service<Persona>({ endpoint: 'personas' })
export const grupoFamiliarService = new Service<GrupoFamiliar>({
  endpoint: 'grupo-familiar',
})
export const situacionLaboralService = new Service<SituacionLaboral>({
  endpoint: 'situacion-laboral',
})
export const situacionAcademicaService = new Service<SituacionAcademica>({
  endpoint: 'situacion-academica',
})
export const economiaService = new Service<Economia>({ endpoint: 'economias' })
export const personaBeneficioService = new Service<PersonaBeneficio>({
  endpoint: 'persona-beneficio',
})
export const expedienteService = new Service<Expediente>({
  endpoint: 'expedientes',
})
export const historialExpedienteService = new Service<HistorialExpediente>({
  endpoint: 'historial-expediente',
})
export const valoracionProfesionalService = new Service<ValoracionProfesional>({
  endpoint: 'valoracion-profesional',
})
