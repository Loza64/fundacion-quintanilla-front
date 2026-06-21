import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    },
  },
})

export const queryKeys = {
  session: ['session'],
  users: ['users'],
  roles: ['roles'],
  permissions: ['permissions'],
  albergues: ['albergues'],
  habitaciones: ['habitaciones'],
  beneficios: ['beneficios'],
  servicios: ['servicios'],
  personas: ['personas'],
  grupoFamiliar: ['grupo-familiar'],
  situacionLaboral: ['situacion-laboral'],
  situacionAcademica: ['situacion-academica'],
  economia: ['economias'],
  personaBeneficio: ['persona-beneficio'],
  expedientes: ['expedientes'],
  historialExpediente: ['historial-expediente'],
  valoracionProfesional: ['valoracion-profesional'],
}
