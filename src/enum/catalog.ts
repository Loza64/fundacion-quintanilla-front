export const TIPO_ALBERGUE = [
  'TEMPORAL',
  'PERMANENTE',
  'ADULTO_MAYOR',
  'INFANTIL',
  'DISCAPACIDAD',
  'MUJERES',
  'HOMBRES',
  'FAMILIAR',
  'EMERGENCIA',
  'REHABILITACION',
  'MIGRANTES',
  'MIXTO',
] as const

export const TIPO_HABITACION = [
  'INDIVIDUAL',
  'COMPARTIDA',
  'FAMILIAR',
  'EMERGENCIA',
  'AISLAMIENTO',
] as const

export const ESTADO_HABITACION = [
  'DISPONIBLE',
  'OCUPADA',
  'RESERVADA',
  'MANTENIMIENTO',
  'INACTIVA',
] as const

export const TIPO_BENEFICIO = [
  'SALUD',
  'EDUCACION',
  'CAPACITACION',
  'EMPLEO',
  'EMPRENDIMIENTO',
  'ALBERGUE',
  'ALIMENTACION',
  'VESTIMENTA',
  'APOYO_SOCIAL',
  'EMERGENCIA',
] as const

export const TIPO_SERVICIO = [
  'MEDICO',
  'PSICOLOGICO',
  'ALIMENTACION',
  'HIGIENE',
  'EDUCACION',
  'RECREACION',
  'ALOJAMIENTO',
  'OTRO',
] as const

export const SEXO = ['MASCULINO', 'FEMENINO'] as const

export const ESTADO_CIVIL = [
  'SOLTERO',
  'CASADO',
  'DIVORCIADO',
  'VIUDO',
  'UNION_LIBRE',
  'SEPARADO',
] as const

export const PARENTESCO = [
  'PADRE',
  'MADRE',
  'HIJO',
  'HIJA',
  'HERMANO',
  'HERMANA',
  'ABUELO',
  'ABUELA',
  'TIO',
  'TIA',
  'PRIMO',
  'PRIMA',
  'CONYUGE',
  'PAREJA',
  'TUTOR',
  'RESPONSABLE',
  'OTRO',
] as const

export const SITUACION_LABORAL_TIPO = [
  'EMPLEADO',
  'DESEMPLEADO',
  'INDEPENDIENTE',
  'ESTUDIANTE',
  'JUBILADO',
  'DISCAPACIDAD',
] as const

export const SITUACION_PARO = ['SIN_PARO', 'EN_PARO', 'SUBSIDIO'] as const

export const PRESTACION_PARO = ['SI', 'NO', 'EN_TRAMITE'] as const

export const NIVEL_ACADEMICO = [
  'PRIMARIA',
  'SECUNDARIA',
  'BACHILLERATO',
  'TECNICO',
  'UNIVERSITARIO',
  'POSTGRADO',
] as const

export const ESTADO_ACADEMICO = [
  'EN_CURSO',
  'COMPLETADO',
  'ABANDONADO',
  'SUSPENDIDO',
] as const

export const TIPO_ECONOMIA = ['INGRESO', 'EGRESO'] as const

export const ESTADO_EXPEDIENTE = [
  'ABIERTO',
  'EN_REVISION',
  'ACTIVO',
  'SUSPENDIDO',
  'CERRADO',
  'ARCHIVADO',
] as const

export const NIVEL_RIESGO = ['BAJO', 'MEDIO', 'ALTO', 'CRITICO'] as const

export const TIPO_EVENTO_EXPEDIENTE = [
  'CREACION',
  'ACTUALIZACION',
  'CAMBIO_ESTADO',
  'VALORACION',
  'ASIGNACION',
  'CIERRE',
  'RESTAURACION',
  'OTRO',
] as const

export const ESPECIALIDAD_PROFESIONAL = [
  'MEDICINA_GENERAL',
  'PSICOLOGIA',
  'PSIQUIATRIA',
  'TRABAJO_SOCIAL',
  'ENFERMERIA',
  'NUTRICION',
  'OTRO',
] as const

export const TIPO_RESIDENTE = [
  'PERMANENTE',
  'TEMPORAL',
  'EMERGENCIA',
  'VOLUNTARIO',
] as const
