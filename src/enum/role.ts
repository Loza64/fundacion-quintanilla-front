export const roles = {
  superAdmin: 'SUPER_ADMIN',
  admin: 'ADMIN',
  encargado: 'ENCARGADO',
  all: '*',
} as const

export type RoleName = (typeof roles)[keyof typeof roles] | (string & {})
